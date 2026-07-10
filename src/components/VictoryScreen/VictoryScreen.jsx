import styles from './VictoryScreen.module.css';

export default function VictoryScreen({ totalCount, bestStreak, onRestart, onLeaderboard }) {
  return (
    <div className={styles.screen} role="dialog" aria-modal="true" aria-label="通关庆祝">
      {/* Rainbow confetti particles */}
      <div className={styles.particles}>
        {Array.from({ length: 30 }, (_, i) => (
          <span
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgOrb3} />

      <div className={styles.card}>
        <div className={styles.trophy}>🏆</div>

        <h2 className={styles.title}>你胜利了！</h2>

        <p className={styles.description}>
          全部 <span className={styles.count}>{totalCount}</span> 个素材都绷住了！
          <br />
          最高连胜：<span className={styles.count}>{bestStreak}</span> 局
          <br />
          你就是面瘫之王！超级无敌老绷带！绷出了个绷样！
        </p>

        <div className={styles.actions}>
          <button className={styles.playAgainBtn} onClick={onRestart} aria-label="再来一局">
            再来一局
          </button>
          <button className={styles.lbBtn} onClick={onLeaderboard} aria-label="排行榜">
            查看排名
          </button>
        </div>
      </div>
    </div>
  );
}
