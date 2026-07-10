import { useState } from 'react';
import styles from './NameEntry.module.css';

export default function NameEntry({ onConfirm }) {
  const [name, setName] = useState('');
  const randomNames = ['冷酷面瘫', '憋笑高手', '石佛本尊', '扑克脸王', '淡定大师'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const final = name.trim() || randomNames[Math.floor(Math.random() * randomNames.length)];
    onConfirm(final);
  };

  const handleRandom = () => {
    const pick = randomNames[Math.floor(Math.random() * randomNames.length)];
    setName(pick);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="输入昵称">
      <div className={styles.card}>
        <div className={styles.icon}>🎭</div>
        <h2 className={styles.title}>欢迎来到绷住大挑战</h2>
        <p className={styles.desc}>输入一个昵称，或者让我们随机生成一个</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入昵称（最长12字）"
            maxLength={12}
            autoFocus
          />
          <div className={styles.actions}>
            <button type="button" className={styles.randomBtn} onClick={handleRandom}>
              🎲 随机
            </button>
            <button type="submit" className={styles.confirmBtn}>
              确认进入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
