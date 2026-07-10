import styles from './ResultScreen.module.css';

export default function ResultScreen({ gameState, resultMessage, streak, onRestart, onLeaderboard }) {
  const isSuccess = gameState === 'success';

  return (
    <div className={`${styles.overlay} ${isSuccess ? styles.success : styles.fail}`}>
      <div className={styles.card}>
        <div className={styles.emoji}>{isSuccess ? '😎' : '😂'}</div>
        <h2 className={`${styles.message} ${isSuccess ? styles.msgSuccess : styles.msgFail}`}>
          {resultMessage}
        </h2>

        {isSuccess && (
          <p className={styles.nextHint}>即将进入下一关...</p>
        )}

        {!isSuccess && (
          <>
            <button className={styles.retryBtn} onClick={onRestart} aria-label="再来一次">
              <span className={styles.btnText}>再来一次</span>
              <span className={styles.btnKey}>Space</span>
            </button>
            <button className={styles.lbBtn} onClick={onLeaderboard} aria-label="排行榜">
              🏆 查看排行榜
            </button>
          </>
        )}
      </div>
    </div>
  );
}
