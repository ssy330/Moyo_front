import { useState, useEffect, useRef } from "react";

export const useResendTimer = (initialTime = 60) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ⏰ 타이머 시작
  const start = () => {
    if (isRunning) return;
    setTimeLeft(initialTime);
    setIsRunning(true);
  };

  // 🕒 타이머 카운트다운
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [isRunning]);

  const formatTime = () => {
    const s = timeLeft % 60;
    return `${s.toString().padStart(2, "0")}`;
  };

  return { isRunning, start, formatTime };
};
