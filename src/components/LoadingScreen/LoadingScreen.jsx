import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.screen} role="status" aria-label="正在加载面部识别">
      <div className={styles.content}>
        <div className={styles.spinner} />
        <h2 className={styles.title}>绷住大挑战</h2>
        <p className={styles.message}>正在初始化面部识别引擎...</p>
        <div className={styles.skeletonBar} />
      </div>
    </div>
  );
}
