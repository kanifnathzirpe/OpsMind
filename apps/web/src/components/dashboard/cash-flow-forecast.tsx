"use client";

import * as React from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { CashFlowData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CashFlowForecastProps {
  data: CashFlowData;
  className?: string;
}

export function CashFlowForecast({ data, className }: CashFlowForecastProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-xl",
        "relative overflow-hidden shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              30-Day Cash Flow Forecast
            </h3>
            <span className="rounded-md bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[11px] font-medium text-cyan-400">
              AI Projected
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Machine learning forecast factoring recurring invoices, scheduled settlements & burn
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-gray-400">Safe-to-Spend Buffer</span>
          <div className="text-base font-bold text-emerald-400">
            ${data.safeToSpend.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Current Total Liquidity</span>
            <span className="text-emerald-400 font-semibold">+8.6%</span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">
            ${data.currentLiquidity.toLocaleString()}
          </div>
          <span className="text-[10px] text-gray-400">
            Across SVB Treasury & Stripe Balances
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Estimated Runway</span>
            <span className="text-cyan-400 font-semibold">Low Burn</span>
          </div>
          <div className="text-xl font-bold text-cyan-400 tracking-tight">
            {data.runwayMonths} Months
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-400 h-full w-[85%]" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Projected 30-Day Net</span>
            <span className="text-emerald-400 font-semibold">Positive Cash</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 tracking-tight">
            +${data.projected30DayNet.toLocaleString()}
          </div>
          <span className="text-[10px] text-gray-400">
            Net inflows exceed operational burn
          </span>
        </div>
      </div>

      {/* Weekly Trend Bars */}
      <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] mb-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-gray-300">4-Week Projection Breakdown</span>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Inflows
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Outflows
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          {data.forecastSeries.map((item) => (
            <div key={item.day} className="text-center p-2 rounded-lg bg-white/[0.02]">
              <span className="text-gray-400 font-mono text-[11px]">{item.day}</span>
              <div className="text-xs font-semibold text-white mt-1">
                ${(item.projectedBalance / 1000).toFixed(0)}k
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px]">
                <span className="text-emerald-400">+${(item.inflow / 1000).toFixed(0)}k</span>
                <span className="text-rose-400">-${(item.outflow / 1000).toFixed(0)}k</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Scheduled Cash Events */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Scheduled Major Inflows & Outflows
          </span>
          <button
            onClick={() => toast.info("Opening Cash Calendar")}
            className="text-[11px] text-cyan-400 hover:underline"
          >
            View Calendar
          </button>
        </div>

        <div className="space-y-2">
          {data.upcomingEvents.map((evt) => {
            const isInflow = evt.type === "inflow";
            return (
              <div
                key={evt.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg border",
                      isInflow
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    )}
                  >
                    {isInflow ? (
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{evt.title}</div>
                    <div className="text-[10px] text-gray-400">
                      {evt.date} • {evt.source}
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "font-semibold text-xs",
                    isInflow ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {isInflow ? "+" : "-"}${evt.amount.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
