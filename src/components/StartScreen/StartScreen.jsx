import styles from './StartScreen.module.css';

export default function StartScreen({ onStart, onLeaderboard }) {
  return (
    <div className={styles.screen}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgOrb3} />

      <div className={styles.card}>
        <div className={styles.badge}>AI 面部识别</div>

        <h1 className={styles.title}>
          <span className={styles.titleGradient}>绷住</span>
          <span className={styles.titleNormal}>大挑战</span>
        </h1>

        <p className={styles.subtitle}>
          面对搞笑内容保持不笑
          <br />
          坚持 <span className={styles.highlight}>7秒</span> 即为胜利
        </p>

        <button className={styles.startBtn} onClick={onStart} aria-label="开始挑战">
          <span className={styles.btnText}>开始挑战</span>
          <span className={styles.btnKey}>Space</span>
        </button>

        <p className={styles.hint}>或按空格键开始</p>

        <button className={styles.leaderboardBtn} onClick={onLeaderboard} aria-label="排行榜">
          排行榜
        </button>
      </div>
    </div>
  );
}
