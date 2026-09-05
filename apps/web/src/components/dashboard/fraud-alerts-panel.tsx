"use client";

import * as React from "react";
import {
  ShieldAlert,
  Ban,
  AlertOctagon,
} from "lucide-react";
import { FraudAlertItem } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FraudAlertsPanelProps {
  alerts: FraudAlertItem[];
  className?: string;
  onAlertChange?: (alerts: FraudAlertItem[]) => void;
}

export function FraudAlertsPanel({
  alerts: initialAlerts,
  className,
  onAlertChange,
}: FraudAlertsPanelProps) {
  const [alerts, setAlerts] = React.useState<FraudAlertItem[]>(initialAlerts);
  const [confirmBlockAlert, setConfirmBlockAlert] = React.useState<FraudAlertItem | null>(null);

  const handleConfirmBlock = () => {
    if (!confirmBlockAlert) return;
    const updated = alerts.map((a) =>
      a.id === confirmBlockAlert.id ? { ...a, status: "blocked" as const } : a
    );
    setAlerts(updated);
    onAlertChange?.(updated);
    toast.error(`Blocked IP ${confirmBlockAlert.ip} & BIN ${confirmBlockAlert.bin} on Sentinel Firewall`);
    setConfirmBlockAlert(null);
  };

  const handleWhitelist = (alertId: string) => {
    const updated = alerts.filter((a) => a.id !== alertId);
    setAlerts(updated);
    onAlertChange?.(updated);
    toast.success(`Transaction whitelisted and marked as false-positive`);
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
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <span>Real-Time Fraud Alerts</span>
              <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-semibold text-rose-400 animate-pulse">
                Live Sentinel
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Instant heuristic and neural network anomaly detection
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-gray-400">
          Threshold: &gt;70 Risk
        </span>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <EmptyState
            type="fraud"
            title="No fraud detected"
            description="Sentinel AI firewall is active. All inbound traffic is currently authenticated."
            actionText="Run Sentinel Scan"
            onAction={() => toast.info("Sentinel AI: Deep network scan running...")}
          />
        ) : (
          alerts.map((alert) => {
          const isBlocked = alert.status === "blocked";
          return (
            <div
              key={alert.id}
              className={cn(
                "p-3.5 rounded-xl border transition-all text-xs",
                isBlocked
                  ? "bg-rose-500/[0.04] border-rose-500/20"
                  : "bg-white/[0.02] border-white/[0.08] hover:border-amber-500/30 hover:bg-white/[0.04]"
              )}
            >
              {/* Header row with Risk Score */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs border",
                      alert.score >= 90
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-400"
                    )}
                    title={`Risk Score: ${alert.score}/100`}
                  >
                    {alert.score}
                  </div>
                  <div>
                    <span className="font-semibold text-white text-xs block">
                      {alert.vector}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {alert.timestamp} • Target: ${alert.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider",
                    isBlocked
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  )}
                >
                  {alert.status}
                </span>
              </div>

              {/* Metadata details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 my-2 border-y border-white/[0.04] text-[11px] text-gray-300">
                <div>
                  <span className="text-gray-400 block text-[10px]">Actor / Account:</span>
                  <span className="font-mono text-white truncate block">
                    {alert.customer}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">IP & Origin:</span>
                  <span className="font-mono text-gray-200 truncate block">
                    {alert.ip} ({alert.location})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Card BIN:</span>
                  <span className="font-mono text-gray-200 truncate block">
                    {alert.bin}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleWhitelist(alert.id)}
                  className="h-6 px-2 text-[11px] text-gray-400 hover:text-white"
                >
                  Whitelist
                </Button>
                {isBlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                    <Ban className="h-3 w-3" />
                    <span>Protected by Firewall</span>
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setConfirmBlockAlert(alert)}
                    className="h-6 px-2.5 text-[11px] bg-rose-600 hover:bg-rose-500 text-white font-medium"
                  >
                    <Ban className="h-3 w-3 mr-1" />
                    <span>Block & Quarantine</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmBlockAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setConfirmBlockAlert(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#0c1228] p-5 shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Confirm Firewall Quarantine
                </h4>
                <span className="text-xs text-gray-400">
                  Sentinel Intrusion Prevention
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Are you sure you want to permanently block incoming transactions from IP{" "}
              <span className="font-mono text-white font-semibold">{confirmBlockAlert.ip}</span> and card BIN{" "}
              <span className="font-mono text-white font-semibold">{confirmBlockAlert.bin}</span>?
              All requests from this origin will be rejected at the edge.
            </p>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmBlockAlert(null)}
                className="h-8 text-xs border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmBlock}
                className="h-8 text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                <Ban className="h-3.5 w-3.5 mr-1" />
                <span>Confirm Block</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
