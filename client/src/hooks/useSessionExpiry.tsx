import { useAuthStore } from "@/features/auth/store/authStore";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SESSION_TIMEOUT = 10 * 60 * 1000;
const WARNING_BEFORE = 9 * 60 * 1000;
const EVENTS = ["click", "keydown", "scroll", "touchstart"] as const;

export const useSessionExpiry = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_BEFORE / 1000);
  const warningTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const logoutTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const countdownInterval = useRef<ReturnType<typeof setInterval>>(undefined);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const startTimers = useCallback(() => {
    clearTimeout(warningTimer.current);
    clearTimeout(logoutTimer.current);
    clearInterval(countdownInterval.current);

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(WARNING_BEFORE / 1000);

      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      countdownInterval.current = interval;
    }, SESSION_TIMEOUT - WARNING_BEFORE);

    logoutTimer.current = setTimeout(() => {
      toast.error("Session expired");
      logout();
      navigate("/");
    }, SESSION_TIMEOUT);
  }, [logout, navigate]);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    startTimers();
  }, [startTimers]);

  useEffect(() => {
    startTimers();

    EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(warningTimer.current);
      clearTimeout(logoutTimer.current);
      clearInterval(countdownInterval.current);
      EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [startTimers, resetTimer]);

  return { showWarning, secondsLeft };
};
