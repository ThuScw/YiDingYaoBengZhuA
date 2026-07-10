import styles from './CountdownTimer.module.css';

export default function CountdownTimer({ timeLeft, visible }) {
  if (!visible) return null;

  const isUrgent = timeLeft <= 3;

  return (
    <div
      className={`${styles.timer} ${isUrgent ? styles.urgent : ''}`}
      role="timer"
      aria-live="assertive"
      aria-label={`剩余 ${timeLeft} 秒`}
      key={timeLeft}
    >
      <span className={styles.number}>{timeLeft}</span>
    </div>
  );
}
