"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Send,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { OrderItem } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OrderDetailDrawerProps {
  order: OrderItem | null;
  onClose: () => void;
  onRefundOrder?: (orderId: string) => void;
}

export function OrderDetailDrawer({
  order,
  onClose,
  onRefundOrder,
}: OrderDetailDrawerProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [isRawJsonOpen, setIsRawJsonOpen] = React.useState(false);
  const [isRefunding, setIsRefunding] = React.useState(false);

  if (!order) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copied ${key} to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRefund = () => {
    setIsRefunding(true);
    setTimeout(() => {
      setIsRefunding(false);
      onRefundOrder?.(order.id);
      toast.success(`Full refund of $${order.amount.toFixed(2)} processed for ${order.orderNumber}`);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl h-full bg-[#0c1228] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between overflow-y-auto"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#0c1228]/95 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white tracking-tight">
                  {order.orderNumber}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
                    order.status === "succeeded"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : order.status === "processing"
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      : order.status === "failed"
                      ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                  )}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Settled via {order.paymentMethod.issuer} • {order.date}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6 flex-1 text-xs">
            {/* Amount Summary Hero Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] shadow-inner">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-gray-400">Total Authorized Amount</span>
                <span className="text-2xl font-extrabold text-white">
                  ${order.amount.toFixed(2)} {order.currency}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-[11px]">
                <div>
                  <span className="text-gray-400 block">Processing Fee:</span>
                  <span className="text-gray-200 font-mono">${order.fee.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Net Settleable:</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    ${order.net.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Identifier Tokens (Copyable) */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Identifiers & Gateway Tokens
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {[
                  { label: "Payment Intent ID", val: order.paymentIntentId },
                  { label: "Charge ID", val: order.chargeId },
                  { label: "Customer ID", val: order.customerId },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]"
                  >
                    <span className="text-gray-400">{item.label}:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-400 truncate max-w-[200px]">
                        {item.val}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.val, item.label)}
                        className="hover:text-white text-gray-400 p-0.5"
                      >
                        {copiedKey === item.label ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Geolocation */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Customer & Network Telemetry
              </span>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                      {order.customerAvatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-gray-400 text-[11px] font-mono">
                        {order.customerEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-[11px]">
                  <div>
                    <span className="text-gray-400 block">IP Address:</span>
                    <span className="text-gray-200 font-mono">{order.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Country:</span>
                    <span className="text-gray-200">{order.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Payment Rail Details
              </span>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <CreditCard className="h-4 w-4 text-blue-400" />
                    <span className="uppercase">{order.paymentMethod.brand}</span>
                    <span className="font-mono">•••• {order.paymentMethod.last4}</span>
                  </div>
                  <span className="text-gray-400 text-[11px] font-mono">
                    Expires {order.paymentMethod.expMonth}/{order.paymentMethod.expYear}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  <span>Issuer: </span>
                  <span className="text-gray-200">{order.paymentMethod.issuer}</span>
                  <span className="mx-1.5">•</span>
                  <span className="capitalize">{order.paymentMethod.funding} card</span>
                </div>
              </div>
            </div>

            {/* Risk Score & Sentinel AI Evaluation */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                ML Risk Score & Sentinel Evaluation
              </span>
              <div
                className={cn(
                  "p-3.5 rounded-xl border space-y-2",
                  order.fraudRiskScore > 80
                    ? "bg-rose-500/[0.04] border-rose-500/30"
                    : "bg-emerald-500/[0.04] border-emerald-500/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {order.fraudRiskScore > 80 ? (
                      <ShieldAlert className="h-4 w-4 text-rose-400" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    )}
                    <span className="font-semibold text-white">
                      Risk Score: {order.fraudRiskScore}/100 ({order.riskLevel.toUpperCase()})
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded",
                      order.fraudRiskScore > 80
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    )}
                  >
                    {order.fraudRiskScore > 80 ? "Blocked by Sentinel" : "Passed Heuristics"}
                  </span>
                </div>

                <p className="text-gray-300 text-[11px] leading-relaxed">
                  {order.riskExplanation}
                </p>

                <div className="space-y-1 pt-1.5 border-t border-white/[0.04]">
                  {order.riskFactors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <span className="h-1 w-1 rounded-full bg-blue-400" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settlement Lifecycle Timeline */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Settlement Lifecycle Timeline
              </span>
              <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.08]">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative text-xs">
                    <div
                      className={cn(
                        "absolute -left-5 top-0.5 h-3.5 w-3.5 rounded-full border flex items-center justify-center bg-[#0c1228]",
                        step.status === "completed"
                          ? "border-emerald-500 text-emerald-400"
                          : step.status === "failed"
                          ? "border-rose-500 text-rose-400"
                          : "border-blue-500 text-blue-400"
                      )}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{step.step}</span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {step.timestamp}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 block">{step.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook & Stripe Event Logs */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Stripe Events & Webhook Deliveries
              </span>
              <div className="space-y-1.5">
                {order.stripeEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04] font-mono text-[10px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <Terminal className="h-3 w-3 text-blue-400" />
                      <span className="text-gray-200">{evt.type}</span>
                    </div>
                    <span className="text-gray-400">{evt.timestamp}</span>
                  </div>
                ))}
                {order.webhookLogs.map((wh) => (
                  <div
                    key={wh.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04] text-[10px]"
                  >
                    <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                      <span className="rounded bg-emerald-500/20 text-emerald-400 px-1 py-0.2 font-mono">
                        {wh.status}
                      </span>
                      <span className="font-mono text-gray-300 truncate">{wh.url}</span>
                    </div>
                    <span className="text-gray-400 font-mono">{wh.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw JSON Toggle */}
            <div className="border-t border-white/[0.06] pt-3">
              <button
                onClick={() => setIsRawJsonOpen(!isRawJsonOpen)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
              >
                {isRawJsonOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                <span>{isRawJsonOpen ? "Hide Gateway Payload" : "View Raw JSON Payload"}</span>
              </button>

              {isRawJsonOpen && (
                <pre className="mt-2 p-3 rounded-xl bg-black/70 border border-white/[0.08] font-mono text-[10px] text-gray-300 overflow-x-auto max-h-60">
                  {JSON.stringify(order, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0c1228] sticky bottom-0 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast.success(`Receipt re-sent to ${order.customerEmail}`);
                }}
                className="h-8 text-xs border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                <span>Resend Receipt</span>
              </Button>

              <Button
                variant="destructive"
                disabled={order.status === "refunded" || isRefunding}
                onClick={handleRefund}
                className="h-8 text-xs bg-rose-600/80 hover:bg-rose-600 text-white font-medium"
              >
                <RotateCcw className={cn("h-3.5 w-3.5 mr-1.5", isRefunding && "animate-spin")} />
                <span>{order.status === "refunded" ? "Already Refunded" : "Process Refund"}</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
