"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpRight,
  Download,
} from "lucide-react";
import { RevenueDataPoint, downloadCSV } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RevenueChartProps {
  data: RevenueDataPoint[];
  className?: string;
  currencySymbol?: string;
}

export function RevenueChart({
  data: initialData,
  className,
  currencySymbol = "$",
}: RevenueChartProps) {
  const [timeframe, setTimeframe] = React.useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [activeMetric, setActiveMetric] = React.useState<"all" | "gross" | "recovered">("all");

  // Dynamically adapt data points based on selected timeframe
  const displayData = React.useMemo(() => {
    if (timeframe === "7d") {
      return initialData.slice(-4);
    }
    if (timeframe === "90d") {
      return initialData.map((d) => ({
        ...d,
        grossRevenue: Math.round(d.grossRevenue * 1.25),
        netRevenue: Math.round(d.netRevenue * 1.22),
        recoveredRevenue: Math.round(d.recoveredRevenue * 1.3),
        ordersCount: Math.round(d.ordersCount * 1.2),
      }));
    }
    if (timeframe === "1y") {
      return initialData.map((d) => ({
        ...d,
        grossRevenue: Math.round(d.grossRevenue * 2.1),
        netRevenue: Math.round(d.netRevenue * 2.05),
        recoveredRevenue: Math.round(d.recoveredRevenue * 2.2),
        ordersCount: Math.round(d.ordersCount * 1.9),
      }));
    }
    return initialData;
  }, [initialData, timeframe]);

  // Summary figures calculated from dataset
  const totalGross = displayData.reduce((acc, curr) => acc + curr.grossRevenue, 0);
  const totalRecovered = displayData.reduce((acc, curr) => acc + curr.recoveredRevenue, 0);
  const totalOrders = displayData.reduce((acc, curr) => acc + curr.ordersCount, 0);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${currencySymbol}${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}k`;
    return `${currencySymbol}${val}`;
  };

  const handleExport = () => {
    downloadCSV(`opsmind-revenue-${timeframe}.csv`, displayData);
    toast.success(`Downloaded opsmind-revenue-${timeframe}.csv`);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-xl",
        "relative overflow-hidden shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Revenue & Recovery Volume
            </h3>
            <span className="rounded-md bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[11px] font-medium text-blue-400">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Real-time multi-currency settlement volume & autonomous AI recoveries
          </p>
        </div>

        {/* Action Controls: Metrics toggle + Timeframe */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Pills */}
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-black/40 p-1 text-xs">
            <button
              onClick={() => setActiveMetric("all")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                activeMetric === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Combined
            </button>
            <button
              onClick={() => setActiveMetric("gross")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                activeMetric === "gross"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Gross
            </button>
            <button
              onClick={() => setActiveMetric("recovered")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                activeMetric === "recovered"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              )}
            >
              AI Recovered
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-black/40 p-1 text-xs">
            {(["7d", "30d", "90d", "1y"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setTimeframe(tf);
                  toast.info(`Switched timeframe to ${tf.toUpperCase()}`);
                }}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium uppercase transition-colors text-[11px]",
                  timeframe === tf
                    ? "bg-white/15 text-white shadow"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-8 text-xs border-white/10 bg-white/[0.02] text-gray-300 hover:text-white hover:bg-white/[0.06]"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Aggregate Stats Sub-header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-6">
        <div>
          <span className="text-[11px] text-gray-400">Aggregated Gross</span>
          <div className="text-lg font-bold text-white mt-0.5">
            {currencySymbol}{(totalGross / 1000).toFixed(1)}k
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="h-2.5 w-2.5" /> +16.8% vs prior
          </span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400">Total AI Recovered</span>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {currencySymbol}{(totalRecovered / 1000).toFixed(1)}k
          </div>
          <span className="text-[10px] text-emerald-300 flex items-center gap-0.5 mt-0.5">
            94.2% capture efficiency
          </span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400">Completed Transactions</span>
          <div className="text-lg font-bold text-white mt-0.5">
            {totalOrders.toLocaleString()}
          </div>
          <span className="text-[10px] text-blue-400 flex items-center gap-0.5 mt-0.5">
            Avg ticket {currencySymbol}128.40
          </span>
        </div>

        <div>
          <span className="text-[11px] text-gray-400">Gateway Fees Saved</span>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">
            {currencySymbol}4,890.20
          </div>
          <span className="text-[10px] text-cyan-300 flex items-center gap-0.5 mt-0.5">
            Via multi-rail routing
          </span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grossRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="netRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="recRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={6}
            />

            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />

            <Tooltip content={<CustomChartTooltip currencySymbol={currencySymbol} />} />

            {(activeMetric === "all" || activeMetric === "gross") && (
              <Area
                type="monotone"
                dataKey="grossRevenue"
                name="Gross Revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#grossRevGrad)"
              />
            )}

            {activeMetric === "all" && (
              <Area
                type="monotone"
                dataKey="netRevenue"
                name="Net Revenue"
                stroke="#818cf8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#netRevGrad)"
              />
            )}

            {(activeMetric === "all" || activeMetric === "recovered") && (
              <Area
                type="monotone"
                dataKey="recoveredRevenue"
                name="Recovered Volume"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#recRevGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between pt-4 mt-2 border-t border-white/[0.06] text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>Gross Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
            <span>Net Inflow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>AI Recovered Volume</span>
          </div>
        </div>
        <div className="text-[11px] text-gray-400">
          Syncs with Stripe, Adyen & Braintree every 30s
        </div>
      </div>
    </div>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RevenueDataPoint }>;
  currencySymbol?: string;
}

function CustomChartTooltip({ active, payload, currencySymbol = "$" }: TooltipProps) {
  if (active && payload && payload.length) {
    const data: RevenueDataPoint = payload[0].payload;
    return (
      <div className="rounded-xl border border-white/15 bg-[#0c1228]/95 p-3 shadow-2xl backdrop-blur-2xl text-xs space-y-1.5 min-w-[190px]">
        <div className="font-semibold text-white border-b border-white/[0.08] pb-1">
          {data.fullDate}
        </div>
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Gross:
            </span>
            <span className="font-semibold text-white">
              {currencySymbol}{data.grossRevenue.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400" /> Net:
            </span>
            <span className="font-semibold text-white">
              {currencySymbol}{data.netRevenue.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Recovered:
            </span>
            <span className="font-semibold text-emerald-400">
              +{currencySymbol}{data.recoveredRevenue.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-400 text-[11px] pt-1 border-t border-white/[0.06]">
            <span>Orders processed:</span>
            <span className="text-gray-200">{data.ordersCount}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
