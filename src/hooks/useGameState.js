import { useState, useRef, useEffect, useCallback } from 'react';
import { useMaterials } from './useMaterials.js';
import { useTimer } from './useTimer.js';
import { useFaceDetection } from './useFaceDetection.js';

export function useGameState({ webcamRef, canvasRef, cameraReady }) {
  const [gameState, setGameState] = useState('idle');
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [resultMessage, setResultMessage] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [remainingCount, setRemainingCount] = useState(0);

  const gameStateRef = useRef('idle');
  const streakRef = useRef(0);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { streakRef.current = streak; }, [streak]);

  const { totalCount, pickNext, resetPool, markUsed, getRemaining, getRemainingCount } =
    useMaterials();

  const handleSmileBreak = useCallback(() => {
    setGameState('fail');
  }, []);

  const { isLoading, smileScore, faceMeshRef, resetCounters, getStruggleScore } =
    useFaceDetection({
      webcamRef,
      canvasRef,
      gameStateRef,
      onSmileBreak: handleSmileBreak,
      enabled: true,
    });

  const isTimerRunning = gameState === 'playing';
  const { timeLeft, isTimeUp, reset: resetTimer } = useTimer({
    duration: 7,
    isRunning: isTimerRunning,
  });

  const startRound = useCallback(
    (material) => {
      setCurrentMaterial(material);
      resetCounters();
      resetTimer();
      setVideoError(false);
      setGameState('preparing');
    },
    [resetCounters, resetTimer],
  );

  // 等待摄像头就绪后再从 preparing 进入 playing，避免计时器在权限/加载阶段空转
  useEffect(() => {
    if (gameState !== 'preparing') return;
    if (!cameraReady) return;

    const timer = setTimeout(() => {
      setGameState('playing');
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, cameraReady]);

  const startNextRound = useCallback(() => {
    const remaining = getRemaining();
    if (remaining.length === 0) {
      setGameState('victory');
      return;
    }
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    markUsed(next);
    setRemainingCount(getRemainingCount());
    startRound(next);
  }, [getRemaining, markUsed, getRemainingCount, startRound]);

  const advanceRound = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    if (!isTimeUp) return;

    const avgStruggle = getStruggleScore();
    const newStreak = streakRef.current + 1;
    setStreak(newStreak);
    setBestStreak((prev) => Math.max(prev, newStreak));

    let msg;
    if (avgStruggle < 1.5) {
      msg = `😎 您已连续绷住 ${newStreak} 局，正在进入下一局...`;
    } else if (avgStruggle < 3.0) {
      msg = `😅 您已连续绷住 ${newStreak} 局，正在进入下一局...`;
    } else {
      msg = `🥵 您已连续绷住 ${newStreak} 局，正在进入下一局...`;
    }
    setResultMessage(msg);
    setGameState('success');
  }, [isTimeUp, getStruggleScore]);

  // 进入 success 后延迟自动进入下一局
  useEffect(() => {
    if (gameState !== 'success') return;

    const timer = setTimeout(() => {
      startNextRound();
    }, 1500);

    return () => clearTimeout(timer);
  }, [gameState, startNextRound]);

  // 进入 fail 时设置消息
  useEffect(() => {
    if (gameState === 'fail') {
      setResultMessage(`😂 破防了！共绷住 ${streakRef.current} 局`);
    }
  }, [gameState]);

  const startGame = useCallback(() => {
    resetPool();
    setStreak(0);
    setBestStreak(0);
    setResultMessage('');
    resetCounters();
    resetTimer();

    const first = pickNext();
    if (!first) return;
    setRemainingCount(getRemainingCount());
    startRound(first);
  }, [resetPool, resetCounters, resetTimer, pickNext, getRemainingCount, startRound]);

  return {
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
  };
}
