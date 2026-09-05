"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Clock,
  Wallet,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react";
import { KPIData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

interface KPICardsProps {
  kpis: KPIData[];
  onSelectMetric?: (metricId: string) => void;
  selectedMetricId?: string;
  currencySymbol?: string;
  multiplier?: number;
  lastUpdatedKpiId?: string;
  lastUpdatedType?: "green" | "red";
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  today_revenue: DollarSign,
  recovered_revenue: TrendingUp,
  fraud_blocked: ShieldCheck,
  pending_payments: Clock,
  cash_position: Wallet,
  growth_rate: Percent,
};

export function KPICards({
  kpis,
  onSelectMetric,
  selectedMetricId,
  currencySymbol = "$",
  multiplier = 1,
  lastUpdatedKpiId,
  lastUpdatedType = "green",
}: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {kpis.map((kpi, index) => {
        const Icon = ICONS[kpi.id] || DollarSign;
        const isSelected = selectedMetricId === kpi.id;
        const isFlashing = lastUpdatedKpiId === kpi.id;

        // Calculate dynamic value based on multiplier and currency
        let displayValue = kpi.value;
        if (kpi.id !== "growth_rate") {
          const scaled = kpi.numericValue * multiplier;
          if (scaled >= 1000000) {
            displayValue = `${currencySymbol}${(scaled / 1000000).toFixed(2)}M`;
          } else {
            displayValue = `${currencySymbol}${scaled.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          }
        }

        // Sparkline path generator
        const minVal = Math.min(...kpi.sparkline);
        const maxVal = Math.max(...kpi.sparkline);
        const range = maxVal - minVal || 1;
        const points = kpi.sparkline
          .map((val, i) => {
            const x = (i / (kpi.sparkline.length - 1)) * 90 + 5;
            const y = 30 - ((val - minVal) / range) * 22 + 4;
            return `${x},${y}`;
          })
          .join(" ");

        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: isFlashing ? [1, 1.025, 1] : 1,
            }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            onClick={() => onSelectMetric?.(kpi.id)}
            className={cn(
              "group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 cursor-pointer select-none",
              "border bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl",
              isFlashing && lastUpdatedType === "green" && "border-emerald-500/80 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20",
              isFlashing && lastUpdatedType === "red" && "border-rose-500/80 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/20",
              !isFlashing && isSelected && "border-blue-500/60 ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10",
              !isFlashing && !isSelected && "border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40"
            )}
          >
            {/* Flash pulse ring */}
            {isFlashing && (
              <span
                className={cn(
                  "absolute inset-0 rounded-2xl animate-ping opacity-25 pointer-events-none",
                  lastUpdatedType === "green" ? "bg-emerald-500" : "bg-rose-500"
                )}
              />
            )}

            {/* Ambient subtle corner glow on hover */}
            <div
              className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40 pointer-events-none"
              style={{ backgroundColor: kpi.accentColor }}
            />

            {/* Top row: Title + Icon */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                {kpi.title}
              </span>
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${kpi.accentColor}15`,
                  borderColor: `${kpi.accentColor}30`,
                  color: kpi.accentColor,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Middle: Big Metric Value with smooth animated transition */}
            <div className="flex items-baseline gap-2 mb-1.5">
              <motion.span
                key={displayValue}
                initial={{ opacity: 0.6, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-xl font-bold tracking-tight text-white group-hover:text-blue-50 transition-colors",
                  isFlashing && lastUpdatedType === "green" && "text-emerald-400 font-extrabold",
                  isFlashing && lastUpdatedType === "red" && "text-rose-400 font-extrabold"
                )}
              >
                {displayValue}
              </motion.span>
              {isFlashing && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center animate-pulse">
                  <Zap className="h-2.5 w-2.5 mr-0.5" /> Live
                </span>
              )}
            </div>

            {/* Mini Sparkline Visualization */}
            <div className="h-8 w-full my-1">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 100 35">
                <defs>
                  <linearGradient id={`grad-${kpi.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={kpi.accentColor} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={kpi.accentColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <polygon
                  points={`5,34 ${points} 95,34`}
                  fill={`url(#grad-${kpi.id})`}
                />
                {/* Stroke line */}
                <polyline
                  fill="none"
                  stroke={kpi.accentColor}
                  strokeWidth={isFlashing ? "2.5" : "2"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>

            {/* Bottom: Change Badge & Context */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[11px]">
              <div
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold text-[10px]",
                  kpi.isPositive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                )}
              >
                {kpi.isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                <span>{kpi.change}</span>
              </div>
              <span className="text-[10px] text-gray-400 truncate max-w-[90px]" title={kpi.comparison}>
                {kpi.comparison}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
