"use client";

import * as React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function OfflineBanner({ className }: { className?: string }) {
  const [isOffline, setIsOffline] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return !navigator.onLine;
  });
  const [isChecking, setIsChecking] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Network connection restored", {
        description: "Autonomous ledger stream re-established",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("Network connection lost", {
        description: "Operating in cached offline mode",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleReconnect = async () => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/dashboard", { method: "HEAD", cache: "no-store" });
      if (res.ok) {
        setIsOffline(false);
        toast.success("Reconnected to OpsMind multi-rail API");
      }
    } catch {
      toast.error("Still offline. Reconnecting in background...");
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOffline) return null;

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-950/80 backdrop-blur-md shadow-2xl shadow-amber-900/40 text-amber-200 text-xs font-medium animate-bounce",
        className
      )}
    >
      <WifiOff className="h-4 w-4 text-amber-400 shrink-0" />
      <span>You are currently offline. Serving cached telemetry.</span>
      <button
        onClick={handleReconnect}
        disabled={isChecking}
        className="flex items-center gap-1 ml-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-white font-semibold transition-colors disabled:opacity-50"
      >
        <RefreshCw className={cn("h-3 w-3", isChecking && "animate-spin")} />
        <span>{isChecking ? "Checking..." : "Reconnect"}</span>
      </button>
    </div>
  );
}
