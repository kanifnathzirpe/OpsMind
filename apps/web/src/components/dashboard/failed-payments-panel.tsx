"use client";

import * as React from "react";
import {
  RotateCcw,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import { FailedPaymentItem } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FailedPaymentsPanelProps {
  payments: FailedPaymentItem[];
  className?: string;
  onPaymentRecovered?: (amount: number) => void;
}

export function FailedPaymentsPanel({
  payments: initialPayments,
  className,
  onPaymentRecovered,
}: FailedPaymentsPanelProps) {
  const [payments, setPayments] = React.useState<FailedPaymentItem[]>(initialPayments);
  const [retryingId, setRetryingId] = React.useState<string | null>(null);
  const [isBatchRetrying, setIsBatchRetrying] = React.useState(false);

  const handleSmartRetry = (item: FailedPaymentItem) => {
    setRetryingId(item.id);
    setTimeout(() => {
      setRetryingId(null);
      setPayments((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, status: "recovered", nextRetry: "Recovered via 3DS fallback" }
            : p
        )
      );
      onPaymentRecovered?.(item.amount);
      toast.success(`Successfully recovered $${item.amount.toFixed(2)} from ${item.customer}!`);
    }, 1100);
  };

  const handleBatchRetryAll = () => {
    setIsBatchRetrying(true);
    setTimeout(() => {
      setIsBatchRetrying(false);
      let total = 0;
      setPayments((prev) =>
        prev.map((p) => {
          if (p.status !== "recovered") {
            total += p.amount;
            return { ...p, status: "recovered", nextRetry: "Batch recovered via Adyen smart-routing" };
          }
          return p;
        })
      );
      if (total > 0) {
        onPaymentRecovered?.(total);
      }
      toast.success(`Batch recovery complete: Recaptured $${total.toFixed(2)} across all pending invoices!`);
    }, 1400);
  };

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
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <RotateCcw className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <span>Failed Payment Recovery</span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                94.2% AI Success
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Autonomous dunning, smart retry orchestration & payment rail failover
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={isBatchRetrying}
          onClick={handleBatchRetryAll}
          className="h-7 text-xs border-white/10 bg-white/[0.02] text-purple-300 hover:text-white hover:bg-purple-500/20"
        >
          <Sparkles className={cn("h-3.5 w-3.5 mr-1", isBatchRetrying && "animate-spin")} />
          <span>{isBatchRetrying ? "Retrying All..." : "Batch Retry All"}</span>
        </Button>
      </div>

      {/* Failed Payments List */}
      <div className="space-y-3">
        {payments.length === 0 ? (
          <EmptyState
            type="payments"
            title="No pending settlements"
            description="All recent transactions cleared successfully. Zero soft declines or failed payments pending recovery."
            actionText="Run Gateway Health Check"
            onAction={() => toast.info("Gateway Health Check: Stripe, Adyen, and Checkout.com are 100% operational.")}
          />
        ) : (
          payments.map((item) => {
          const isRecovered = item.status === "recovered";
          const isCurrentlyRetrying = retryingId === item.id || isBatchRetrying;

          return (
            <div
              key={item.id}
              className={cn(
                "p-3.5 rounded-xl border transition-all text-xs",
                isRecovered
                  ? "bg-emerald-500/[0.04] border-emerald-500/20"
                  : "bg-white/[0.02] border-white/[0.08] hover:border-purple-500/30 hover:bg-white/[0.04]"
              )}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-white text-xs">
                    {item.customer}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {item.email} • {item.gateway}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-xs">
                    ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    {item.recoveryProbability}% recovery probability
                  </div>
                </div>
              </div>

              {/* Decline Reason Banner */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/[0.04] my-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <AlertOctagon className="h-3 w-3 text-amber-400 flex-shrink-0" />
                  <span className="font-mono text-amber-300 text-[10px]">
                    {item.declineCode}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300 text-[10px] truncate max-w-[200px]">
                    {item.declineReason}
                  </span>
                </div>

                <span className="text-gray-400 text-[10px] whitespace-nowrap">
                  Attempt #{item.attempts}
                </span>
              </div>

              {/* Footer action row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <Clock className="h-3 w-3 text-purple-400" />
                  <span>Next action: {item.nextRetry}</span>
                </div>

                {isRecovered ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Recovered</span>
                  </span>
                ) : (
                  <Button
                    size="sm"
                    disabled={isCurrentlyRetrying}
                    onClick={() => handleSmartRetry(item)}
                    className="h-6 px-2.5 text-[11px] bg-purple-600 hover:bg-purple-500 text-white font-medium"
                  >
                    <Zap className={cn("h-3 w-3 mr-1", isCurrentlyRetrying && "animate-spin")} />
                    <span>{isCurrentlyRetrying ? "Retrying Rail..." : "Smart Retry"}</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
