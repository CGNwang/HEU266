import { useState, useEffect, useCallback } from 'react';

interface UseCountdownOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useCountdown({ initialSeconds, onComplete, autoStart = true }: UseCountdownOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);

  const reset = useCallback((newSeconds?: number) => {
    setSeconds(newSeconds ?? initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!autoStart || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoStart, seconds, onComplete]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return {
    seconds,
    hours,
    minutes,
    secs,
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
    reset,
    isComplete: seconds === 0,
  };
}

export default useCountdown;