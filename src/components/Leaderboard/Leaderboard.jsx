import { useEffect } from 'react';
import styles from './Leaderboard.module.css';

export default function Leaderboard({
  uid,
  leaderboard,
  userRank,
  userBest,
  loading,
  onClose,
  onRefresh,
  embedded,
}) {
  useEffect(() => {
    onRefresh();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const isInTop20 = leaderboard.some(r => r.uid === uid);

  const panel = (
    <div className={`${styles.panel} ${embedded ? styles.embeddedPanel : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>🏆 排行榜</h2>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={onRefresh} disabled={loading} aria-label="刷新">
            🔄
          </button>
          {!embedded && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="关闭">
              ✕
            </button>
          )}
        </div>
      </div>

      {loading && leaderboard.length === 0 && (
        <div className={styles.loading}>加载中...</div>
      )}

      {!loading && leaderboard.length === 0 && (
        <div className={styles.empty}>
          {embedded ? '暂无数据，连接 Supabase 后查看排名' : '暂无数据，快来成为第一名吧！'}
        </div>
      )}

      <div className={styles.list}>
        <div className={styles.listHeader}>
          <span className={styles.colRank}>#</span>
          <span className={styles.colName}>玩家</span>
          <span className={styles.colStreak}>连胜</span>
          <span className={styles.colTime}>时间</span>
        </div>

        {leaderboard.map((row, i) => {
          const isMe = row.uid === uid;
          return (
            <div key={row.uid} className={`${styles.row} ${isMe ? styles.myRow : ''}`}>
              <span className={`${styles.colRank} ${i < 3 ? styles[`rank${i + 1}`] : ''}`}>
                {i + 1}
              </span>
              <span className={styles.colName}>{row.uid}</span>
              <span className={styles.colStreak}>{row.streak}</span>
              <span className={styles.colTime}>{formatDate(row.created_at)}</span>
            </div>
          );
        })}
      </div>

      {userRank !== null && !isInTop20 && (
        <div className={styles.mySection}>
          <div className={styles.row + ' ' + styles.myRow}>
            <span className={styles.colRank}>{userRank}</span>
            <span className={styles.colName}>{uid}（你）</span>
            <span className={styles.colStreak}>{userBest ?? '-'}</span>
            <span className={styles.colTime}>—</span>
          </div>
        </div>
      )}

      {userBest === null && !loading && (
        <div className={styles.noRecord}>
          你还没有记录，完成一局游戏后自动上榜！
        </div>
      )}
    </div>
  );

  if (embedded) {
    return panel;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      {panel}
    </div>
  );
}
