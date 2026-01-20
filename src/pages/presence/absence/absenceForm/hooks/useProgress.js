import { useRef, useState, useCallback } from 'react';

export const useProgress = () => {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    setProgress(10);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.floor(Math.random() * 8) + 4));
    }, 400);
  }, []);

  const finish = useCallback(() => {
    clearInterval(timerRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 600);
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setProgress(0);
  }, []);

  return { progress, start, finish, reset };
};
