"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Failed to load telemetry",
  message = "A network anomaly or timeout occurred while communicating with the autonomous engine.",
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/20 bg-gradient-to-b from-rose-950/20 via-rose-900/10 to-transparent backdrop-blur-md select-none",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 mb-3 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h4 className="text-sm font-semibold text-white tracking-tight mb-1">
        {title}
      </h4>

      <p className="text-xs text-gray-400 max-w-sm mb-4 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="h-8 text-xs border-rose-500/30 bg-rose-500/10 text-rose-300 hover:text-white hover:bg-rose-500/20 transition-colors"
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5 mr-1.5", isRetrying && "animate-spin")}
          />
          <span>{isRetrying ? "Retrying..." : "Retry Request"}</span>
        </Button>
      )}
    </div>
  );
}
