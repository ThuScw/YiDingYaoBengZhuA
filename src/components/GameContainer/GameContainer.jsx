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
  } = useGameState({ webcamRef, canvasRef });

  useEffect(() => {
    if ((gameState === 'victory' || gameState === 'fail') && hasUid && !submitted && bestStreak > 0) {
      setSubmitted(true);
      submitScore(uid, bestStreak, totalCount);
    }
    if (gameState === 'idle') {
      setSubmitted(false);
    }
  }, [gameState, hasUid, bestStreak, uid, totalCount, submitted, submitScore]);

  const canStart = gameState === 'idle' || gameState === 'fail' || gameState === 'victory';

  const handleStart = useCallback(() => {
    if (canStart) startGame();
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

        <div className={styles.layout}>
          {showGame ? (
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
          ) : (
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
        </div>
      </div>
    </>
  );
}
