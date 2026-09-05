"use client";

import * as React from "react";
import {
  Activity,
  Bot,
  ShieldAlert,
  RotateCcw,
  Wallet,
  Settings,
  Clock,
} from "lucide-react";
import { ActivityTimelineItem } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface RecentActivityTimelineProps {
  activities: ActivityTimelineItem[];
  className?: string;
}

const TYPE_CONFIG = {
  payment: { icon: Bot, color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
  fraud: { icon: ShieldAlert, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30" },
  recovery: { icon: RotateCcw, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  forecast: { icon: Wallet, color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30" },
  settings: { icon: Settings, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
};

export function RecentActivityTimeline({
  activities,
  className,
}: RecentActivityTimelineProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-xl",
        "relative overflow-hidden shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Recent Activity & Audit Trail
            </h3>
            <p className="text-xs text-gray-400">
              Complete chronological audit stream of autonomous AI and user events
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-gray-400">
          Sync: Realtime
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.08]">
        {activities.map((item) => {
          const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.payment;
          const Icon = config.icon;

          return (
            <div key={item.id} className="relative group text-xs">
              {/* Timeline Marker Dot */}
              <div
                className={cn(
                  "absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border bg-[#070b19]",
                  config.border,
                  config.color
                )}
              >
                <Icon className="h-2.5 w-2.5" />
              </div>

              {/* Event Content Box */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 group-hover:bg-white/[0.04] group-hover:border-white/[0.12] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-xs">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                    <Clock className="h-2.5 w-2.5" />
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-gray-300 text-[11px] leading-relaxed mb-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.04] text-[10px]">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span>Actor:</span>
                    <span
                      className={cn(
                        "font-medium px-1.5 py-0.2 rounded border text-[10px]",
                        item.actorType === "ai"
                          ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                          : item.actorType === "user"
                          ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                          : "bg-white/[0.05] text-gray-300 border-white/10"
                      )}
                    >
                      {item.actor}
                    </span>
                  </div>

                  {item.metadata && (
                    <span className="font-mono text-gray-400">
                      {item.metadata}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
