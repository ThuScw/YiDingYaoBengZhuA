import { useState, useCallback } from 'react';
import { getSupabase } from '../lib/supabase.js';

// 计算当前周的起始时间（周一 00:00:00）
function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
  const diff = day === 0 ? 6 : day - 1; // 距离周一的天数
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userBest, setUserBest] = useState(null);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabase();

  const submitScore = useCallback(async (uid, streak, totalMaterials) => {
    if (!supabase || !uid || streak === 0) return { error: null };

    try {
      const weekStart = getWeekStart();

      // 查询该用户本周的最高分
      const { data: existing, error: selectError } = await supabase
        .from('scores')
        .select('streak')
        .eq('uid', uid)
        .gte('created_at', weekStart.toISOString())
        .order('streak', { ascending: false })
        .limit(1);

      if (selectError) {
        console.error('[submitScore] select failed:', selectError);
      }

      const currentBest = existing?.[0]?.streak ?? null;

      // 未超越本周最高分时不插入，避免数据膨胀
      if (currentBest !== null && streak <= currentBest) {
        return { error: null };
      }

      // 新高分或首次提交：INSERT 新记录（RLS 仅允许 INSERT，不支持 UPDATE）
      // 排行榜查询时会按 uid 去重取最高分，旧记录保留不影响显示
      const { error } = await supabase
        .from('scores')
        .insert({ uid, streak, total_materials: totalMaterials });

      if (error) {
        console.error('[submitScore] insert failed:', error);
      }
      return { error };
    } catch (err) {
      console.error('[submitScore] exception:', err);
      return { error: err };
    }
  }, [supabase]);

  const fetchLeaderboard = useCallback(async (uid) => {
    if (!supabase) {
      setLeaderboard([]);
      setUserRank(null);
      setUserBest(null);
      return;
    }

    setLoading(true);

    const weekStart = getWeekStart();
    const weekStartISO = weekStart.toISOString();

    // 获取该用户本周的最高分
    const { data: userData } = await supabase
      .from('scores')
      .select('streak')
      .eq('uid', uid)
      .gte('created_at', weekStartISO)
      .order('streak', { ascending: false })
      .limit(1);

    const best = userData?.[0]?.streak ?? null;
    setUserBest(best);

    // 获取本周 Top 20（每人取最高分）
    const { data: topData } = await supabase
      .from('scores')
      .select('uid, streak, total_materials, created_at')
      .gte('created_at', weekStartISO)
      .order('streak', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(100);

    // 每人只保留最高分记录
    const seen = new Set();
    const deduped = [];
    for (const row of topData || []) {
      if (!seen.has(row.uid)) {
        seen.add(row.uid);
        deduped.push(row);
        if (deduped.length >= 20) break;
      }
    }
    setLeaderboard(deduped);

    // 计算当前用户排名（仅本周数据）
    if (best !== null) {
      const rankIdx = deduped.findIndex(r => r.uid === uid);
      if (rankIdx !== -1) {
        setUserRank(rankIdx + 1);
      } else {
        // 用户不在 top 20，统计本周比 ta 分数高的人数
        const { count } = await supabase
          .from('scores')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekStartISO)
          .gt('streak', best);
        setUserRank((count ?? 0) + 1);
      }
    } else {
      setUserRank(null);
    }

    setLoading(false);
  }, [supabase]);

  return {
    leaderboard,
    userRank,
    userBest,
    loading,
    submitScore,
    fetchLeaderboard,
    isConfigured: supabase !== null,
  };
}
