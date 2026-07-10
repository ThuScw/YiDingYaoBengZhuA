import { useRef, useEffect, useState, useCallback } from 'react';

const BREAK_THRESHOLD = 30;
const BREAK_DURATION = 700; // ms — 微笑指数 > 30 且持续 0.7s 才算破绷

export function useFaceDetection({ webcamRef, canvasRef, gameStateRef, onSmileBreak, enabled }) {
  const faceMeshRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [smileScore, setSmileScore] = useState(0);

  const aboveThresholdSince = useRef(null); // timestamp when smile first crossed threshold
  const struggleScoreRef = useRef(0);
  const totalFramesRef = useRef(0);
  const onSmileBreakRef = useRef(onSmileBreak);

  useEffect(() => {
    onSmileBreakRef.current = onSmileBreak;
  }, [onSmileBreak]);

  const resetCounters = useCallback(() => {
    aboveThresholdSince.current = null;
    struggleScoreRef.current = 0;
    totalFramesRef.current = 0;
  }, []);

  const getStruggleScore = useCallback(() => {
    if (totalFramesRef.current === 0) return 0;
    return struggleScoreRef.current / totalFramesRef.current;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const initFaceMesh = () => {
      if (cancelled) return;

      if (!window.FaceMesh) {
        setTimeout(initFaceMesh, 100);
        return;
      }

      const faceMesh = new window.FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => {
        if (cancelled) return;
        setIsLoading(false);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const video = webcamRef.current?.video;
        if (!video) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];

          const gs = gameStateRef.current;
          ctx.fillStyle = gs === 'fail' ? '#ff8787' : '#ff6b8a';

          for (let i = 0; i < landmarks.length; i++) {
            ctx.beginPath();
            ctx.arc(
              landmarks[i].x * canvas.width,
              landmarks[i].y * canvas.height,
              1.2,
              0,
              2 * Math.PI,
            );
            ctx.fill();
          }

          const mouthTop = landmarks[13];
          const mouthBottom = landmarks[14];
          const mouthLeft = landmarks[61];
          const mouthRight = landmarks[291];
          const chin = landmarks[10];
          const forehead = landmarks[151];

          const mouthCenterY = (mouthTop.y + mouthBottom.y) / 2;
          const mouthCornerY = (mouthLeft.y + mouthRight.y) / 2;
          const faceHeight = Math.abs(chin.y - forehead.y);

          const smileDelta = mouthCenterY - mouthCornerY;
          const smileRatio = (smileDelta / faceHeight) * 100;
          setSmileScore(parseFloat(smileRatio.toFixed(2)));

          if (gs === 'playing') {
            totalFramesRef.current++;
            const now = performance.now();

            if (smileRatio > BREAK_THRESHOLD) {
              if (aboveThresholdSince.current === null) {
                aboveThresholdSince.current = now;
              } else if (now - aboveThresholdSince.current >= BREAK_DURATION) {
                aboveThresholdSince.current = null;
                onSmileBreakRef.current?.();
              }
            } else {
              aboveThresholdSince.current = null;
              struggleScoreRef.current += smileRatio;
            }
          } else if (gs === 'preparing') {
            aboveThresholdSince.current = null;
          }
        }
      });

      faceMeshRef.current = faceMesh;
    };

    initFaceMesh();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { isLoading, smileScore, faceMeshRef, resetCounters, getStruggleScore };
}
