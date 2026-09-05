"use client";

import * as React from "react";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterState } from "@/store/use-store";

interface AdvancedFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  resultsCount?: number;
  className?: string;
}

const PRESETS = [
  { id: "all", label: "Default" },
  { id: "high_risk_value", label: "High Risk (>70 Score)", filter: { riskLevel: "high", minAmount: 500 } },
  { id: "failed_payments", label: "Failed / Soft-Decline", filter: { status: "failed" } },
  { id: "stripe_us", label: "Stripe US Gateway", filter: { gateway: "stripe", currency: "USD" } },
  { id: "adyen_eu", label: "Adyen EU (EUR)", filter: { gateway: "adyen", currency: "EUR" } },
];

export function AdvancedFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  resultsCount,
  className,
}: AdvancedFilterBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hasActiveFilters = Boolean(
    filters.status ||
    filters.gateway ||
    filters.currency ||
    filters.country ||
    filters.minAmount ||
    filters.maxAmount ||
    filters.riskLevel
  );

  const handlePresetSelect = (presetId: string, presetFilter?: Partial<FilterState>) => {
    if (presetId === "all") {
      onResetFilters();
    } else if (presetFilter) {
      onFilterChange({ ...presetFilter, preset: presetId });
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Top Bar: Presets & Filter Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Preset Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 mr-1">
            <Sparkles className="h-3 w-3 text-blue-400" />
            Presets:
          </span>
          {PRESETS.map((preset) => {
            const isSelected =
              preset.id === "all"
                ? !hasActiveFilters
                : filters.preset === preset.id;

            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id, preset.filter)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border",
                  isSelected
                    ? "bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-sm shadow-blue-500/10"
                    : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2">
          {resultsCount !== undefined && (
            <span className="text-xs text-gray-400 font-mono">
              {resultsCount} records
            </span>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "h-7 text-xs border-white/10 bg-white/[0.02] text-gray-300 hover:text-white",
              isOpen && "border-blue-500/40 bg-blue-500/10 text-blue-300"
            )}
          >
            <SlidersHorizontal className="h-3 w-3 mr-1.5 text-blue-400" />
            <span>Advanced Filters</span>
            <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", isOpen && "rotate-180")} />
          </Button>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onResetFilters}
              className="h-7 px-2 text-xs text-gray-400 hover:text-white"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filter Controls */}
      {isOpen && (
        <div className="p-4 rounded-xl border border-white/10 bg-[#080d1e]/90 backdrop-blur-md grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Status</label>
            <select
              value={filters.status || "all"}
              onChange={(e) => onFilterChange({ status: e.target.value === "all" ? undefined : e.target.value })}
              className="w-full h-8 px-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all" className="bg-[#080d1e]">All Statuses</option>
              <option value="succeeded" className="bg-[#080d1e]">Succeeded</option>
              <option value="pending" className="bg-[#080d1e]">Pending</option>
              <option value="processing" className="bg-[#080d1e]">Processing</option>
              <option value="failed" className="bg-[#080d1e]">Failed</option>
              <option value="refunded" className="bg-[#080d1e]">Refunded</option>
            </select>
          </div>

          {/* Gateway Filter */}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Payment Rail</label>
            <select
              value={filters.gateway || "all"}
              onChange={(e) => onFilterChange({ gateway: e.target.value === "all" ? undefined : e.target.value })}
              className="w-full h-8 px-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all" className="bg-[#080d1e]">All Gateways</option>
              <option value="stripe" className="bg-[#080d1e]">Stripe US</option>
              <option value="adyen" className="bg-[#080d1e]">Adyen EU</option>
              <option value="braintree" className="bg-[#080d1e]">Braintree Global</option>
              <option value="ach" className="bg-[#080d1e]">Direct Treasury ACH</option>
            </select>
          </div>

          {/* Currency Filter */}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Currency</label>
            <select
              value={filters.currency || "all"}
              onChange={(e) => onFilterChange({ currency: e.target.value === "all" ? undefined : e.target.value })}
              className="w-full h-8 px-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all" className="bg-[#080d1e]">All Currencies</option>
              <option value="USD" className="bg-[#080d1e]">USD ($)</option>
              <option value="EUR" className="bg-[#080d1e]">EUR (€)</option>
              <option value="GBP" className="bg-[#080d1e]">GBP (£)</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Sentinel Risk</label>
            <select
              value={filters.riskLevel || "all"}
              onChange={(e) => onFilterChange({ riskLevel: e.target.value === "all" ? undefined : e.target.value })}
              className="w-full h-8 px-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all" className="bg-[#080d1e]">All Risk Levels</option>
              <option value="low" className="bg-[#080d1e]">Low Risk (0-30)</option>
              <option value="medium" className="bg-[#080d1e]">Medium (31-70)</option>
              <option value="high" className="bg-[#080d1e]">High Risk (71-100)</option>
            </select>
          </div>

          {/* Min Amount */}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Min Amount ($)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minAmount ?? ""}
              onChange={(e) => onFilterChange({ minAmount: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full h-8 px-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">Max Amount ($)</label>
            <input
              type="number"
              placeholder="10000"
              value={filters.maxAmount ?? ""}
              onChange={(e) => onFilterChange({ maxAmount: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full h-8 px-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] uppercase font-mono text-gray-500">Active:</span>
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              Status: {filters.status}
              <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => onFilterChange({ status: undefined })} />
            </span>
          )}
          {filters.gateway && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              Gateway: {filters.gateway}
              <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => onFilterChange({ gateway: undefined })} />
            </span>
          )}
          {filters.currency && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              Currency: {filters.currency}
              <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => onFilterChange({ currency: undefined })} />
            </span>
          )}
          {filters.riskLevel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
              Risk: {filters.riskLevel}
              <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => onFilterChange({ riskLevel: undefined })} />
            </span>
          )}
          {filters.minAmount !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              &ge; ${filters.minAmount}
              <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => onFilterChange({ minAmount: undefined })} />
            </span>
          )}
          {filters.maxAmount !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              &le; ${filters.maxAmount}
              <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => onFilterChange({ maxAmount: undefined })} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
