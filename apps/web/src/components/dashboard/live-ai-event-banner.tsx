"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  TrendingUp,
  RotateCcw,
  LineChart,
  Zap,
  Sparkles,
  X,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIEventItem {
  id: string;
  type: "fraud" | "recovery" | "retry" | "forecast" | "reroute" | "learning";
  title: string;
  description: string;
  timeAgo: string;
  colorScheme: "orange" | "green" | "blue" | "purple";
  icon: React.ComponentType<{ className?: string }>;
}

const AI_EVENTS: AIEventItem[] = [
  {
    id: "evt-fraud",
    type: "fraud",
    title: "Fraud Blocked",
    description: "Quarantined TOR exit node probing BIN 400022 across guest checkouts.",
    timeAgo: "12s ago",
    colorScheme: "orange",
    icon: ShieldAlert,
  },
  {
    id: "evt-recovery",
    type: "recovery",
    title: "Payment Recovered",
    description: "Smart Retry salvaged $320.00 soft decline for card •••• 8412.",
    timeAgo: "28s ago",
    colorScheme: "green",
    icon: TrendingUp,
  },
  {
    id: "evt-reroute",
    type: "reroute",
    title: "Gateway Rerouted",
    description: "Shifted 140 EU checkouts to Adyen Amsterdam to bypass 3DS latency.",
    timeAgo: "45s ago",
    colorScheme: "blue",
    icon: Zap,
  },
  {
    id: "evt-learning",
    type: "learning",
    title: "AI Learned New Pattern",
    description: "Identified and neutralized zero-day credential stuffing fingerprint.",
    timeAgo: "1m ago",
    colorScheme: "purple",
    icon: Sparkles,
  },
  {
    id: "evt-retry",
    type: "retry",
    title: "Retry Succeeded",
    description: "Automated dunning salvaged $4,190.50 invoice for Nordic Media.",
    timeAgo: "2m ago",
    colorScheme: "green",
    icon: RotateCcw,
  },
  {
    id: "evt-forecast",
    type: "forecast",
    title: "Forecast Updated",
    description: "30-day liquidity model revised: Safe-to-spend buffer at $420,000.",
    timeAgo: "3m ago",
    colorScheme: "blue",
    icon: LineChart,
  },
];

const COLOR_MAP = {
  green: {
    bg: "bg-[#071712]/90",
    border: "border-emerald-500/40",
    glow: "shadow-emerald-500/20",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
    progress: "bg-emerald-500",
  },
  blue: {
    bg: "bg-[#081328]/90",
    border: "border-blue-500/40",
    glow: "shadow-blue-500/20",
    text: "text-blue-400",
    iconBg: "bg-blue-500/20",
    progress: "bg-blue-500",
  },
  orange: {
    bg: "bg-[#1f1208]/90",
    border: "border-amber-500/40",
    glow: "shadow-amber-500/20",
    text: "text-amber-400",
    iconBg: "bg-amber-500/20",
    progress: "bg-amber-500",
  },
  purple: {
    bg: "bg-[#140b24]/90",
    border: "border-purple-500/40",
    glow: "shadow-purple-500/20",
    text: "text-purple-400",
    iconBg: "bg-purple-500/20",
    progress: "bg-purple-500",
  },
};

interface LiveAIEventBannerProps {
  isVisible?: boolean;
}

export function LiveAIEventBanner({ isVisible = true }: LiveAIEventBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Rotation cycle every 10 seconds
  React.useEffect(() => {
    if (!isVisible || isDismissed || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AI_EVENTS.length);
    }, 9500);

    return () => clearInterval(interval);
  }, [isVisible, isDismissed, isPaused]);

  if (!isVisible || isDismissed) return null;

  const currentEvent = AI_EVENTS[currentIndex];
  const colors = COLOR_MAP[currentEvent.colorScheme];
  const Icon = currentEvent.icon;

  return (
    <aside
      aria-label="Live AI Operating System Event Stream"
      className="fixed top-20 right-4 sm:right-6 z-40 w-80 sm:w-96 select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent.id}
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={cn(
            "relative rounded-2xl border backdrop-blur-2xl p-3.5 shadow-2xl transition-all duration-300 overflow-hidden",
            colors.bg,
            colors.border,
            colors.glow
          )}
        >
          {/* Top row: Live OS pill + Icon + Title + time + dismiss */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg border",
                  colors.iconBg,
                  colors.border,
                  colors.text
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn("text-xs font-bold tracking-tight", colors.text)}>
                  {currentEvent.title}
                </span>
                <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300">
                  <Bot className="h-2.5 w-2.5" /> OS Live
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-mono">
                {currentEvent.timeAgo}
              </span>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-gray-400 hover:text-white p-0.5 rounded-md transition-colors"
                title="Dismiss AI layer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] text-gray-300 leading-snug pl-9 pr-2">
            {currentEvent.description}
          </p>

          {/* Animated 9.5-second progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.06] overflow-hidden">
            <motion.div
              key={currentEvent.id + (isPaused ? "-paused" : "")}
              initial={{ width: "0%" }}
              animate={{ width: isPaused ? "100%" : "100%" }}
              transition={{
                duration: isPaused ? 0 : 9.5,
                ease: "linear",
              }}
              className={cn("h-full", colors.progress)}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
