import styles from './DebugOverlay.module.css';

export default function DebugOverlay({ smileScore }) {
  const level = smileScore > 3.5 ? 'danger' : smileScore > 2.5 ? 'warn' : 'safe';

  return (
    <div className={styles.overlay} aria-hidden="true">
      <span className={styles.label}>微笑指数</span>
      <span className={`${styles.value} ${styles[level]}`}>
        {smileScore}
      </span>
    </div>
  );
}
