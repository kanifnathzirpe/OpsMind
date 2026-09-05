"use client";

import * as React from "react";
import {
  PackageX,
  ShieldCheck,
  BellOff,
  UserX,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type: "orders" | "fraud" | "notifications" | "customers" | "payments" | "general";
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const CONFIGS = {
  orders: {
    icon: PackageX,
    title: "No Orders Found",
    description: "No transaction records match your active query or status filter.",
    actionText: "Reset Filters",
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  fraud: {
    icon: ShieldCheck,
    title: "Zero Threats Detected",
    description: "Sentinel AI firewall is active. All inbound traffic is currently authenticated.",
    actionText: "Run Sentinel Scan",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  notifications: {
    icon: BellOff,
    title: "All Caught Up",
    description: "You have zero unread notifications across multi-gateway telemetry.",
    actionText: "Refresh Stream",
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  customers: {
    icon: UserX,
    title: "No Customer Accounts",
    description: "No customer profiles match the current search keyword.",
    actionText: "Clear Search",
    accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  payments: {
    icon: ShieldCheck,
    title: "No Failed Payments",
    description: "All recent transactions cleared successfully. Zero soft declines pending recovery.",
    actionText: "Run Gateway Health Check",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  general: {
    icon: PackageX,
    title: "No Records Found",
    description: "No data points match your active criteria.",
    actionText: "Refresh",
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
};

export function EmptyState({
  type,
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  const config = CONFIGS[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-white/[0.06] bg-white/[0.01] select-none",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl border mb-3 shadow-inner",
          config.accent
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h4 className="text-sm font-semibold text-white tracking-tight mb-1">
        {title || config.title}
      </h4>

      <p className="text-xs text-gray-400 max-w-sm mb-4">
        {description || config.description}
      </p>

      {onAction && (
        <Button
          size="sm"
          variant="outline"
          onClick={onAction}
          className="h-8 text-xs border-white/10 bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.08]"
        >
          <RotateCcw className="h-3 w-3 mr-1.5" />
          <span>{actionText || config.actionText}</span>
        </Button>
      )}
    </div>
  );
}
