"use client";

import * as React from "react";
import { useBillingQuery } from "@/hooks/queries/use-dashboard-queries";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Download,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function BillingTab() {
  const { data: billing, isLoading } = useBillingQuery();

  if (isLoading || !billing) {
    return (
      <div className="py-12 flex justify-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
      </div>
    );
  }

  const tokenPercentage = Math.round(
    (billing.usage.aiTokensUsed / billing.usage.aiTokensLimit) * 100
  );
  const apiPercentage = Math.round(
    (billing.usage.apiCallsUsed / billing.usage.apiCallsLimit) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-400" />
          Billing & Enterprise Plan
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage merchant billing tiers, payment methods, compute allocations, and tax invoices.
        </p>
      </div>

      {/* Plan Card & Payment Method Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Plan Card (2 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-[#0d1226]/80 to-[#0d1226]/80 p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400 uppercase tracking-wide">
                Active Subscription
              </span>
              <h3 className="text-2xl font-bold text-white mt-1.5">{billing.planName}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Next billing cycle on <span className="text-white font-medium">{billing.renewsOn}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                ${billing.planPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400"> / month</span>
              <p className="text-[11px] text-emerald-400 flex items-center sm:justify-end gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" />
                <span>Auto-renew active</span>
              </p>
            </div>
          </div>

          {/* Usage Meters */}
          <div className="mt-5 space-y-4">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Current Cycle Quotas & Usage
            </h4>

            {/* AI Tokens Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  AI Agent Reasoning Tokens
                </span>
                <span className="text-white font-mono text-[11px]">
                  {(billing.usage.aiTokensUsed / 1000000).toFixed(2)}M /{" "}
                  {(billing.usage.aiTokensLimit / 1000000).toFixed(0)}M ({tokenPercentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${tokenPercentage}%` }}
                />
              </div>
            </div>

            {/* API Ingestion Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Gateway Ingestion Events
                </span>
                <span className="text-white font-mono text-[11px]">
                  {(billing.usage.apiCallsUsed / 1000).toFixed(0)}k /{" "}
                  {(billing.usage.apiCallsLimit / 1000000).toFixed(0)}M ({apiPercentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${apiPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.08] flex-wrap gap-2">
            <span className="text-xs text-gray-400">
              Need custom multi-tenant clusters or dedicated inference hardware?
            </span>
            <Button
              size="sm"
              onClick={() => toast.success("Contacting enterprise account representative")}
              className="h-8 text-xs bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10"
            >
              Upgrade Tier
            </Button>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d1226]/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Payment Rail
              </h4>
              <span className="text-[10px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2">
                Primary
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 p-4 text-white space-y-4 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold tracking-wider font-mono">VISA BUSINESS</span>
                <ShieldCheck className="h-4 w-4 text-blue-400" />
              </div>
              <p className="font-mono text-sm tracking-widest text-gray-300">
                •••• •••• •••• {billing.paymentMethod.last4}
              </p>
              <div className="flex justify-between items-end text-[10px] text-gray-400">
                <div>
                  <p className="uppercase text-[8px]">Cardholder</p>
                  <p className="font-medium text-gray-200">{billing.paymentMethod.holderName}</p>
                </div>
                <div>
                  <p className="uppercase text-[8px]">Expires</p>
                  <p className="font-medium text-gray-200">
                    {billing.paymentMethod.expMonth}/{billing.paymentMethod.expYear}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08] space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Opening Stripe billing portal...")}
              className="w-full h-8 text-xs border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
            >
              <ExternalLink className="h-3 w-3 mr-1.5" />
              Manage in Stripe Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-white">Billing History & Tax Invoices</h3>
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0d1226]/50">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">Billing Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {billing.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-white">{inv.number}</td>
                  <td className="py-3 px-4 text-gray-400">{inv.date}</td>
                  <td className="py-3 px-4 font-semibold text-white">${inv.amount.toLocaleString()}.00</td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toast.success(`Downloaded ${inv.number}.pdf`)}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
                    >
                      <Download className="h-3 w-3" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
