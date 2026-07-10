import styles from './GradientText.module.css';

export default function GradientText({
  children,
  as: Tag = 'span',
  colors = ['#ff6b8a', '#ffa94d', '#ffd43b', '#b197fc', '#63e6be'],
  speed = 4,
  className = '',
  ...rest
}) {
  return (
    <Tag
      className={`${styles.text} ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})`,
        backgroundSize: `${colors.length * 100}% ${colors.length * 100}%`,
        animationDuration: `${speed}s`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
