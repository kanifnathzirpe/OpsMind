"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  message?: string;
  description?: string;
  className?: string;
  variant?: "card" | "inline" | "skeleton";
}

export function LoadingState({
  message = "Syncing autonomous telemetry...",
  description = "Connecting to distributed ledger and Sentinel AI models",
  className,
  variant = "card",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 space-y-4 animate-pulse",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-white/[0.08] rounded-md" />
          <div className="h-6 w-16 bg-white/[0.04] rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/[0.08] rounded-md" />
          <div className="h-3 w-64 bg-white/[0.04] rounded-md" />
        </div>
        <div className="h-24 w-full bg-white/[0.02] border border-white/[0.04] rounded-xl" />
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 py-4 px-3 text-xs text-gray-400 select-none",
          className
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent backdrop-blur-md select-none min-h-[220px]",
        className
      )}
    >
      <div className="relative mb-4 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-inner">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-1">
        <h4 className="text-sm font-semibold text-white tracking-tight">
          {message}
        </h4>
        <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
      </div>

      {description && (
        <p className="text-xs text-gray-400 max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
}
