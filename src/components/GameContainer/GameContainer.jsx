import { useRef, useCallback, useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState.js';
import { useKeyboard } from '../../hooks/useKeyboard.js';
import { useUser } from '../../hooks/useUser.js';
import { useLeaderboard } from '../../hooks/useLeaderboard.js';
import NavBar from '../NavBar/NavBar';
import StartScreen from '../StartScreen/StartScreen';
import ContentPanel from '../ContentPanel/ContentPanel';
import CameraPanel from '../CameraPanel/CameraPanel';
import ResultScreen from '../ResultScreen/ResultScreen';
import VictoryScreen from '../VictoryScreen/VictoryScreen';
import NameEntry from '../NameEntry/NameEntry';
import Leaderboard from '../Leaderboard/Leaderboard';
import GameIntro from '../GameIntro/GameIntro';
import styles from './GameContainer.module.css';

export default function GameContainer() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const { uid, setUid, hasUid } = useUser();
  const {
    leaderboard,
    userRank,
    userBest,
    loading: lbLoading,
    submitScore,
    fetchLeaderboard,
  } = useLeaderboard();

  const [activeTab, setActiveTab] = useState('game');
  const [submitted, setSubmitted] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState(false);

  const {
    gameState,
    timeLeft,
    isTimeUp,
    streak,
    bestStreak,
    currentMaterial,
    smileScore,
    resultMessage,
    videoError,
    isLoading,
    faceMeshRef,
    totalCount,
    remainingCount,
    startGame,
    advanceRound,
  } = useGameState({ webcamRef, canvasRef, cameraAllowed });

  useEffect(() => {
    if ((gameState === 'victory' || gameState === 'fail') && hasUid && !submitted && bestStreak > 0) {
      setSubmitted(true);
      submitScore(uid, bestStreak, totalCount).then(({ error }) => {
        if (error) {
          setSubmitted(false);
        }
      });
    }
    if (gameState === 'idle') {
      setSubmitted(false);
    }
  }, [gameState, hasUid, bestStreak, uid, totalCount, submitted, submitScore]);

  const canStart = gameState === 'idle' || gameState === 'fail' || gameState === 'victory';

  const handleStart = useCallback(() => {
    if (canStart) {
      setSubmitted(false);
      startGame();
    }
  }, [canStart, startGame]);

  const handleAdvance = useCallback(() => {
    advanceRound();
  }, [advanceRound]);

  const handleLeaderboard = useCallback(() => {
    setActiveTab('leaderboard');
    fetchLeaderboard(uid);
  }, [fetchLeaderboard, uid]);

  useKeyboard({
    Space: () => {
      if (activeTab !== 'game') return;
      if (!hasUid) return;
      if (gameState === 'playing' && isTimeUp) {
        handleAdvance();
        return;
      }
      handleStart();
    },
  });

  const isOverlay = gameState === 'success' || gameState === 'fail';
  const showGame = activeTab === 'game';

  return (
    <>
      {!hasUid && <NameEntry onConfirm={setUid} />}

      <div className={styles.app}>
        <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className={`${styles.layout} ${showGame ? '' : styles.fullWidth}`}>
          {showGame && (
            <>
              <CameraPanel
                webcamRef={webcamRef}
                canvasRef={canvasRef}
                faceMeshRef={faceMeshRef}
                gameState={gameState}
                timeLeft={timeLeft}
                isTimeUp={isTimeUp}
                smileScore={smileScore}
                isLoading={isLoading}
                streak={streak}
                remainingCount={remainingCount}
                totalCount={totalCount}
                cameraAllowed={cameraAllowed}
                onCameraAllowed={setCameraAllowed}
                onStart={handleStart}
                onAdvance={handleAdvance}
              />

              {gameState === 'idle' && (
                <StartScreen onStart={handleStart} onLeaderboard={handleLeaderboard} />
              )}

              {gameState !== 'idle' && gameState !== 'victory' && (
                <ContentPanel
                  gameState={gameState}
                  currentMaterial={currentMaterial}
                  videoError={videoError}
                  videoRef={videoRef}
                  isTimeUp={isTimeUp}
                  onAdvance={handleAdvance}
                />
              )}

              {isOverlay && (
                <ResultScreen
                  gameState={gameState}
                  resultMessage={resultMessage}
                  streak={streak}
                  onRestart={handleStart}
                  onLeaderboard={handleLeaderboard}
                />
              )}

              {gameState === 'victory' && (
                <VictoryScreen
                  totalCount={totalCount}
                  bestStreak={bestStreak}
                  onRestart={handleStart}
                  onLeaderboard={handleLeaderboard}
                />
              )}
            </>
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard
              uid={uid}
              leaderboard={leaderboard}
              userRank={userRank}
              userBest={userBest}
              loading={lbLoading}
              onRefresh={() => fetchLeaderboard(uid)}
              embedded
            />
          )}

          {activeTab === 'intro' && <GameIntro />}
        </div>
      </div>
    </>
  );
}
