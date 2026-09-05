"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Clock, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

interface SessionTimeoutModalProps {
  idleTimeoutMinutes?: number; // default 15 mins
  warningSeconds?: number; // default 60s warning
}

export function SessionTimeoutModal({
  idleTimeoutMinutes = 15,
  warningSeconds = 60,
}: SessionTimeoutModalProps) {
  const { isAuthenticated, refreshToken, logout } = useAuth();
  const [showWarning, setShowWarning] = React.useState(false);
  const [countdown, setCountdown] = React.useState(warningSeconds);
  const lastActivityRef = React.useRef<number>(0);

  // Listen to user interactions
  React.useEffect(() => {
    if (!isAuthenticated) return;
    lastActivityRef.current = Date.now();

    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      if (showWarning) {
        setShowWarning(false);
        setCountdown(warningSeconds);
      }
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));

    // Periodic check every 5 seconds
    const interval = setInterval(() => {
      const idleMs = Date.now() - lastActivityRef.current;
      const timeoutMs = idleTimeoutMinutes * 60 * 1000;
      const warningThresholdMs = timeoutMs - warningSeconds * 1000;

      if (idleMs >= timeoutMs) {
        // Expired -> auto logout
        setShowWarning(false);
        logout();
      } else if (idleMs >= warningThresholdMs && !showWarning) {
        // Enter warning state
        setShowWarning(true);
        setCountdown(Math.ceil((timeoutMs - idleMs) / 1000));
      }
    }, 5000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
      clearInterval(interval);
    };
  }, [isAuthenticated, idleTimeoutMinutes, warningSeconds, showWarning, logout]);

  // Countdown timer when warning is active
  React.useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning, logout]);

  const handleExtend = async () => {
    await refreshToken();
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setCountdown(warningSeconds);
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="session-warning-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-[#0c1228] p-6 shadow-2xl shadow-black/80 space-y-5"
          >
            <div className="flex items-center gap-3 text-amber-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 id="session-warning-title" className="text-base font-bold text-white tracking-tight">
                  Session Timeout Warning
                </h3>
                <span className="text-xs text-amber-300/80 font-mono">
                  Enterprise SSO Guard
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              You have been inactive on this node. For compliance and financial data security, your session will automatically terminate in:
            </p>

            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-xl">
              <Clock className="h-5 w-5 animate-pulse" />
              <span>00:{countdown.toString().padStart(2, "0")}</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={logout}
                className="flex-1 h-9 border-white/10 bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.08] text-xs"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                <span>Logout Now</span>
              </Button>

              <Button
                onClick={handleExtend}
                className="flex-1 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                <span>Extend Session</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
