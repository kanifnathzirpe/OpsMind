"use client";

import * as React from "react";
import {
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { OrderItem, downloadCSV } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderDetailDrawer } from "./order-detail-drawer";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OrdersTableProps {
  orders: OrderItem[];
  className?: string;
  currencySymbol?: string;
  selectedOrder?: OrderItem | null;
  onSelectOrder?: (order: OrderItem | null) => void;
  onRefundOrder?: (orderId: string) => void;
}

export function OrdersTable({
  orders,
  className,
  currencySymbol = "$",
  selectedOrder: externalSelectedOrder,
  onSelectOrder: externalOnSelectOrder,
  onRefundOrder,
}: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [internalSelectedOrder, setInternalSelectedOrder] = React.useState<OrderItem | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const activeOrder = externalSelectedOrder !== undefined ? externalSelectedOrder : internalSelectedOrder;
  const setActiveOrder = (order: OrderItem | null) => {
    if (externalOnSelectOrder) {
      externalOnSelectOrder(order);
    } else {
      setInternalSelectedOrder(order);
    }
  };

  // Memoized Filter logic
  const filteredOrders = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return orders.filter((o) => {
      const matchesSearch =
        !term ||
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.customerEmail.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ? true : o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`Copied ${text} to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    downloadCSV("opsmind-filtered-orders.csv", filteredOrders);
    toast.success(`Exported ${filteredOrders.length} orders as CSV`);
  };

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "succeeded":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Succeeded</span>
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-xs font-medium text-blue-400">
            <Clock className="h-3 w-3 animate-spin" />
            <span>Processing</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-400">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-xs font-medium text-rose-400">
            <AlertCircle className="h-3 w-3" />
            <span>Failed</span>
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-xs font-medium text-purple-300">
            <RotateCcw className="h-3 w-3" />
            <span>Refunded</span>
          </span>
        );
    }
  };

  const getRiskBadge = (score: number, level: OrderItem["riskLevel"]) => {
    if (level === "high" || score > 80) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[11px] font-semibold text-rose-400">
          <ShieldAlert className="h-3 w-3" />
          <span>High ({score})</span>
        </span>
      );
    }
    if (level === "medium" || score > 25) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
          <span>Medium ({score})</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
        <ShieldCheck className="h-3 w-3" />
        <span>Low ({score})</span>
      </span>
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-xl",
        "relative overflow-hidden shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-white tracking-tight">
              Recent Orders & Settlements
            </h3>
            <span className="rounded-full bg-white/[0.06] border border-white/[0.1] px-2 py-0.5 text-xs text-gray-300 font-mono">
              {filteredOrders.length} records
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Real-time feed of multi-gateway checkouts, authorization levels, and risk evaluation
          </p>
        </div>

        {/* Controls: Search + Filter Tabs + CSV Download */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by customer, ID..."
              className="h-8 pl-8 pr-3 text-xs bg-black/40 border-white/[0.08] text-white placeholder:text-gray-400 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-black/40 p-1 text-xs overflow-x-auto">
            {["all", "succeeded", "processing", "pending", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium capitalize transition-colors text-[11px]",
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Export Orders Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 text-xs border-white/10 bg-white/[0.02] text-gray-300 hover:text-white"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/20">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-white/[0.02] border-b border-white/[0.06] text-gray-400 font-medium">
            <tr>
              <th className="py-3 px-4">Order Number</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment Rail</th>
              <th className="py-3 px-4">Risk Evaluation</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 px-4">
                  <EmptyState
                    type="orders"
                    title="No matching transactions"
                    description={searchTerm || statusFilter !== "all" ? `Zero transactions matched your query "${searchTerm || statusFilter}".` : "No transaction records found."}
                    actionText="Reset Search & Filters"
                    onAction={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  />
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  {/* Order Number */}
                  <td className="py-3 px-4 font-mono font-medium text-blue-400 flex items-center gap-1.5">
                    <span>{order.orderNumber}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(order.orderNumber);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-white"
                      title="Copy ID"
                    >
                      {copiedId === order.orderNumber ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-[10px] text-white">
                        {order.customerAvatar}
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-blue-300 transition-colors">
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                          {order.customerEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>

                  {/* Amount */}
                  <td className="py-3 px-4 font-semibold text-white">
                    {currencySymbol}{order.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-gray-300 font-mono text-[11px]">
                      <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                      <span className="uppercase">{order.paymentMethod.brand}</span>
                      <span className="text-gray-400">••••</span>
                      <span>{order.paymentMethod.last4}</span>
                    </div>
                  </td>

                  {/* Risk Score */}
                  <td className="py-3 px-4">
                    {getRiskBadge(order.fraudRiskScore, order.riskLevel)}
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-4 text-gray-400 text-[11px]">
                    <div>{order.date}</div>
                    <div className="text-[10px] text-gray-400">{order.time}</div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveOrder(order);
                      }}
                      className="h-7 px-2 text-xs text-blue-400 hover:text-white hover:bg-blue-600/20"
                    >
                      <span>Details</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Bar */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/[0.04] text-xs text-gray-400">
        <span>
          Showing 1 to {filteredOrders.length} of {orders.length} transactions
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-7 w-7 border-white/10 bg-white/[0.02] text-gray-400"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="px-2 py-1 text-xs text-white font-medium">Page 1 of 1</span>
          <Button
            variant="outline"
            size="icon"
            disabled
            className="h-7 w-7 border-white/10 bg-white/[0.02] text-gray-400"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Connected OrderDetailDrawer */}
      <OrderDetailDrawer
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        onRefundOrder={onRefundOrder}
      />
    </div>
  );
}
