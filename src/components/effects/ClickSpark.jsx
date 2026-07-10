import { useCallback, useEffect, useRef } from 'react';
import styles from './ClickSpark.module.css';

const COLORS = ['#ff6b8a', '#ffa94d', '#ffd43b', '#b197fc', '#63e6be', '#74c0fc', '#f783ac'];

export default function ClickSpark({ sparkCount = 8, sparkSize = 8, children }) {
  const containerRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('span');
        spark.className = styles.spark;
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const distance = 30 + Math.random() * 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const size = sparkSize * (0.5 + Math.random() * 0.8);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        spark.style.cssText = `
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          --dx: ${dx}px;
          --dy: ${dy}px;
          background: ${color};
          box-shadow: 0 0 ${size * 2}px ${color};
        `;

        containerRef.current?.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove());
      }
    },
    [sparkCount, sparkSize],
  );

  return (
    <div ref={containerRef} className={styles.container} onClick={handleClick}>
      {children}
    </div>
  );
}
