import { useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import DebugOverlay from '../DebugOverlay/DebugOverlay';
import StatusBar from '../StatusBar/StatusBar';
import CameraPermissionGuide from './CameraPermissionGuide';
import styles from './CameraPanel.module.css';

export default function CameraPanel({
  webcamRef,
  canvasRef,
  faceMeshRef,
  gameState,
  timeLeft,
  isTimeUp,
  smileScore,
  isLoading,
  streak,
  remainingCount,
  totalCount,
  cameraAllowed,
  onCameraAllowed,
  onStart,
  onAdvance,
}) {
  const frameIdRef = useRef(null);
  const loopStartedRef = useRef(false);

  const onUserMedia = useCallback(() => {
    if (loopStartedRef.current) return;
    loopStartedRef.current = true;

    const video = webcamRef.current.video;
    const sendFrame = async () => {
      if (faceMeshRef.current && video.readyState === 4) {
        try {
          await faceMeshRef.current.send({ image: video });
        } catch {
          // 忽略初始化未完成的错误
        }
      }
      frameIdRef.current = requestAnimationFrame(sendFrame);
    };
    sendFrame();
  }, [webcamRef, faceMeshRef]);

  useEffect(() => {
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  const isPlaying = gameState === 'playing';
  const showTimer = gameState === 'playing' && !isTimeUp;
  const showAdvanceBtn = gameState === 'playing' && isTimeUp;
  const showButton = gameState === 'idle' || gameState === 'fail' || gameState === 'victory';
  const isFail = gameState === 'fail';
  const showStatus = gameState !== 'victory' && gameState !== 'idle' && gameState !== 'fail';

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>绷住</span>大挑战
        </h1>
        <StatusBar
          streak={streak}
          remainingCount={remainingCount}
          totalCount={totalCount}
          visible={showStatus}
        />
      </div>

      <div className={styles.cameraArea}>
        {!cameraAllowed ? (
          <CameraPermissionGuide onAllow={onCameraAllowed} />
        ) : (
        <div className={`${styles.webcamWrapper} ${isFail ? styles.fail : isPlaying ? styles.playing : ''}`}>
          <Webcam
            audio={false}
            ref={webcamRef}
            onUserMedia={onUserMedia}
            screenshotFormat="image/jpeg"
            className={styles.webcam}
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: 'user',
            }}
          />
          <canvas ref={canvasRef} className={styles.canvas} />

          {isLoading && (
            <div className={styles.loadingBadge} aria-label="面部识别初始化中">
              <span className={styles.loadingDot} />
              面部识别初始化中...
            </div>
          )}

          <DebugOverlay smileScore={smileScore} />
          <CountdownTimer timeLeft={timeLeft} visible={showTimer} />

          {showButton && (
            <button
              className={styles.startBtn}
              onClick={onStart}
              aria-label={gameState === 'idle' ? '开始挑战' : '再来一次'}
            >
              <span className={styles.btnContent}>
                {gameState === 'idle' ? '开始挑战' : '再来一次'}
              </span>
              <span className={styles.btnHint}>Space</span>
            </button>
          )}

          {showAdvanceBtn && (
            <button
              className={styles.advanceBtn}
              onClick={onAdvance}
              aria-label="绷住了"
            >
              <span className={styles.btnContent}>绷住了！</span>
              <span className={styles.btnHint}>Space</span>
            </button>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
