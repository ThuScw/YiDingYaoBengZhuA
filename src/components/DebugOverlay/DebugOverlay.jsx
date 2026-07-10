import styles from './DebugOverlay.module.css';

export default function DebugOverlay({ smileScore }) {
  const level = smileScore > 20 ? 'danger' : smileScore > 0 ? 'warn' : 'safe';

  return (
    <div className={styles.overlay} aria-hidden="true">
      <span className={styles.label}>破绷指数</span>
      <span className={`${styles.value} ${styles[level]}`}>
        {smileScore}
      </span>
    </div>
  );
}
