import { useEffect } from 'react';
import StatusBar from '../StatusBar/StatusBar';
import styles from './ContentPanel.module.css';

export default function ContentPanel({
  gameState,
  currentMaterial,
  streak,
  remainingCount,
  totalCount,
  videoError,
  videoRef,
  isTimeUp,
  onAdvance,
}) {
  const showStatus = gameState !== 'victory' && gameState !== 'idle' && gameState !== 'fail';
  const isPreparing = gameState === 'preparing';
  const isActive = gameState === 'playing' || gameState === 'preparing';
  const showAdvanceHint = gameState === 'playing' && isTimeUp;

  useEffect(() => {
    if ((gameState === 'preparing' || gameState === 'playing') && currentMaterial?.type === 'video') {
      const video = videoRef?.current;
      if (video) {
        video.currentTime = 0;
        video.play().then(() => {
          video.muted = false;
        }).catch(() => {});
      }
    }
  }, [gameState, currentMaterial, videoRef]);

  return (
    <div className={styles.panel}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>绷住</span>大挑战
        </h1>

        <StatusBar
          streak={streak}
          remainingCount={remainingCount}
          totalCount={totalCount}
          visible={showStatus}
        />

        <div className={styles.mediaBox}>
          {isActive && currentMaterial && (
            <div className={styles.mediaContainer}>
              {currentMaterial.type === 'text' && (
                <p className={styles.textContent}>{currentMaterial.content}</p>
              )}
              {currentMaterial.type === 'image' && (
                <img
                  src={currentMaterial.content}
                  alt="搞笑图片"
                  className={styles.media}
                />
              )}
              {currentMaterial.type === 'video' && !videoError && (
                <video
                  key={currentMaterial.id}
                  ref={videoRef}
                  src={currentMaterial.content}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={styles.media}
                />
              )}
              {currentMaterial.type === 'video' && videoError && (
                <p className={styles.errorText}>视频无法播放，可能是编码格式不兼容</p>
              )}

              {isPreparing && (
                <div className={styles.preparingOverlay}>
                  <span className={styles.preparingEmoji}>😎</span>
                  <span className={styles.preparingText}>准备...</span>
                </div>
              )}

            </div>
          )}

          {showAdvanceHint && (
            <div className={styles.advanceHint}>
              <span className={styles.advanceHintIcon}>✅</span>
              <span>7秒已到，绷住了就点击左侧按钮晋级</span>
            </div>
          )}

          {!isActive && (
            <p className={styles.placeholder}>
              {gameState === 'idle' && '点击右侧按钮开始挑战，7秒内不许笑！'}
              {gameState === 'success' && '即将进入下一关...'}
              {gameState === 'fail' && '再接再厉，重新开始吧！'}
              {gameState === 'victory' && '你已经是面瘫之王！'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
