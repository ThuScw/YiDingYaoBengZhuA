import styles from './NavBar.module.css';

export default function NavBar({ activeTab, onTabChange }) {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>绷住大挑战</span>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'game' ? styles.active : ''}`}
          onClick={() => onTabChange('game')}
        >
          挑战
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'leaderboard' ? styles.active : ''}`}
          onClick={() => onTabChange('leaderboard')}
        >
          排行榜
        </button>
      </div>
    </nav>
  );
}
