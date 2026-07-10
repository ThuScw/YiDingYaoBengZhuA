import styles from './CameraPermissionGuide.module.css';

export default function CameraPermissionGuide({ onAllow }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.cameraIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <div className={styles.scanLine} />
        </div>

        <h2 className={styles.title}>开启摄像头</h2>
        <p className={styles.description}>
          游戏需要访问摄像头来检测你的表情
          <br />
          判断你是否"绷不住"笑了
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔒</span>
            <span>数据仅在本地处理</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🚫</span>
            <span>不会上传或录制视频</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✨</span>
            <span>实时面部关键点检测</span>
          </div>
        </div>

        <button className={styles.allowBtn} onClick={onAllow}>
          <span>允许使用摄像头</span>
          <span className={styles.btnArrow}>→</span>
        </button>

        <p className={styles.hint}>
          点击后浏览器会弹出权限请求，请选择"允许"
        </p>
      </div>
    </div>
  );
}
