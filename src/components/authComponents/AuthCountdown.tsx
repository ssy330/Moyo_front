import { useEffect, useState, memo } from "react";

interface AuthCountdownProps {
  initialTime?: number;
  onExpire?: () => void;
}

function AuthCountdown({ initialTime = 300, onExpire }: AuthCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <span
      className={`text-sm ${timeLeft > 0 ? "text-gray-500" : "text-red-500"}`}
    >
      {timeLeft > 0 ? `${minutes}:${seconds}` : "만료됨"}
    </span>
  );
}

export default memo(AuthCountdown);
