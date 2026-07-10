import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer({ duration, isRunning }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setTimeLeft(duration);
    setElapsed(0);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(secs);
      setTimeLeft(Math.max(0, duration - secs));
    }, 100);

    return () => clearInterval(timer);
  }, [isRunning, duration]);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    setElapsed(0);
  }, [duration]);

  const isTimeUp = timeLeft <= 0;

  return { timeLeft, elapsed, isTimeUp, reset };
}
