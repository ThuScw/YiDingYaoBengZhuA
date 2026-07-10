import styles from './StatusBar.module.css';

export default function StatusBar({ streak, remainingCount, totalCount, visible }) {
  if (!visible) return null;

  const pct = totalCount > 0 ? ((totalCount - remainingCount) / totalCount) * 100 : 0;

  return (
    <div className={styles.bar}>
      {streak > 0 && (
        <div className={styles.streak}>
          <span className={styles.streakIcon}>🔥</span>
          <span className={styles.streakText}>连续 {streak} 局</span>
        </div>
      )}

      <div className={styles.progress}>
        <span className={styles.progressLabel}>
          剩余 {remainingCount}/{totalCount}
        </span>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
