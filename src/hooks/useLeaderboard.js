import { useState, useCallback } from 'react';
import { getSupabase } from '../lib/supabase.js';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userBest, setUserBest] = useState(null);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabase();

  const submitScore = useCallback(async (uid, streak, totalMaterials) => {
    if (!supabase || !uid || streak === 0) return { error: null };
    const { error } = await supabase
      .from('scores')
      .insert({ uid, streak, total_materials: totalMaterials });
    return { error };
  }, [supabase]);

  const fetchLeaderboard = useCallback(async (uid) => {
    if (!supabase) {
      setLeaderboard([]);
      setUserRank(null);
      setUserBest(null);
      return;
    }

    setLoading(true);

    // 获取该用户的最高分
    const { data: userData } = await supabase
      .from('scores')
      .select('streak')
      .eq('uid', uid)
      .order('streak', { ascending: false })
      .limit(1);

    const best = userData?.[0]?.streak ?? null;
    setUserBest(best);

    // 获取 Top 20（每人取最高分）
    const { data: topData } = await supabase
      .from('scores')
      .select('uid, streak, total_materials, created_at')
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

    // 计算当前用户排名
    if (best !== null) {
      const rankIdx = deduped.findIndex(r => r.uid === uid);
      if (rankIdx !== -1) {
        setUserRank(rankIdx + 1);
      } else {
        // 用户不在 top 20，统计比 ta 分数高的人数
        const { count } = await supabase
          .from('scores')
          .select('*', { count: 'exact', head: true })
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
