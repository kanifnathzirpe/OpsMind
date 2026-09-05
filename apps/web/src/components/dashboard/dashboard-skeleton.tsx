"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function KpiCardsSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5", className)}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-28 rounded" />
          <Skeleton className="h-8 w-full rounded" />
          <div className="flex justify-between items-center pt-1">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4 animate-pulse", className)}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-44 rounded" />
        <Skeleton className="h-8 w-60 rounded-lg" />
      </div>
      <div className="space-y-2.5">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-white/[0.03]">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 flex-1 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4 animate-pulse", className)}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-48 rounded" />
        <Skeleton className="h-8 w-44 rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-3 py-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}

export function DrawerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 p-6 animate-pulse select-none", className)}>
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-3 w-64 rounded" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
      <div className="pt-4 border-t border-white/[0.06] flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function PanelSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3 animate-pulse", className)}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="h-6 w-6 rounded-lg" />
      </div>
      <div className="space-y-2.5">
        {[...Array(3)].map((_, j) => (
          <Skeleton key={j} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards Skeletons */}
      <KpiCardsSkeleton />

      {/* Main Grid: Revenue Chart + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartSkeleton className="lg:col-span-2" />
        <PanelSkeleton />
      </div>

      {/* Orders Table Skeleton */}
      <TableSkeleton rows={6} />

      {/* Bottom Grid: Cash Flow + Fraud + Failed Payments + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <PanelSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
