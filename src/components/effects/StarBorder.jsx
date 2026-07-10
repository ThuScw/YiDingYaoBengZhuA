import styles from './StarBorder.module.css';

const STARS = ['✦', '✧', '⋆', '✶', '·'];

function Star({ char, index, total }) {
  const angle = (360 / total) * index;
  const delay = Math.random() * 2;

  return (
    <span
      className={styles.star}
      style={{
        '--angle': `${angle}deg`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      {char}
    </span>
  );
}

export default function StarBorder({ children, starCount = 8, className = '' }) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {Array.from({ length: starCount }, (_, i) => (
        <Star key={i} char={STARS[i % STARS.length]} index={i} total={starCount} />
      ))}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
