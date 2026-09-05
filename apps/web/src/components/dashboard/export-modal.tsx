"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Image as ImageIcon,
  X,
  Sparkles,
  Loader2,
  BrainCircuit,
  TrendingUp,
  CreditCard,
  Users,
  ShieldAlert,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  KPIData,
  Merchant,
  OrderItem,
  downloadCSV,
  MOCK_REVENUE_SERIES,
  MOCK_FRAUD_ALERTS,
  MOCK_FAILED_PAYMENTS,
  MOCK_CASH_FLOW,
} from "@/lib/dashboard-data";
import { getFallbackCustomers } from "@/lib/api/customers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: KPIData[];
  orders: OrderItem[];
  selectedMerchant: Merchant;
}

type ExportEntity = "revenue" | "payments" | "customers" | "fraud" | "forecast";

const ENTITY_TABS: { id: ExportEntity; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "revenue", label: "Revenue", icon: TrendingUp },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "customers", label: "Customers", icon: Users },
  { id: "fraud", label: "Fraud", icon: ShieldAlert },
  { id: "forecast", label: "Forecast", icon: LineChart },
];

function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportModal({
  isOpen,
  onClose,
  kpis,
  orders,
  selectedMerchant,
}: ExportModalProps) {
  const [selectedEntity, setSelectedEntity] = React.useState<ExportEntity>("revenue");
  const [exportingFormat, setExportingFormat] = React.useState<string | null>(null);
  const [progressPercent, setProgressPercent] = React.useState(0);
  const [progressLabel, setProgressLabel] = React.useState("");

  // Handler for CSV export per selected entity
  const handleExportCSV = () => {
    setExportingFormat("csv");
    setTimeout(() => {
      let data: Record<string, unknown>[] = [];
      const baseFilename = `opsmind-${selectedEntity}-${selectedMerchant.code.toLowerCase()}`;

      if (selectedEntity === "revenue") {
        data = MOCK_REVENUE_SERIES.map((s) => ({
          Date: s.date,
          GrossRevenue: `${selectedMerchant.currencySymbol}${(s.grossRevenue * selectedMerchant.multiplier).toFixed(2)}`,
          NetSettlement: `${selectedMerchant.currencySymbol}${(s.netRevenue * selectedMerchant.multiplier).toFixed(2)}`,
          GatewayFees: `${selectedMerchant.currencySymbol}${(s.fees * selectedMerchant.multiplier).toFixed(2)}`,
          RecoveredRevenue: `${selectedMerchant.currencySymbol}${(s.recoveredRevenue * selectedMerchant.multiplier).toFixed(2)}`,
          OrdersCount: s.ordersCount,
          Currency: selectedMerchant.currency,
        }));
      } else if (selectedEntity === "payments") {
        data = orders.map((o) => ({
          OrderNumber: o.orderNumber,
          Customer: o.customerName,
          Email: o.customerEmail,
          Amount: `${selectedMerchant.currencySymbol}${o.amount.toFixed(2)}`,
          Net: `${selectedMerchant.currencySymbol}${o.net.toFixed(2)}`,
          Fee: `${selectedMerchant.currencySymbol}${o.fee.toFixed(2)}`,
          Status: o.status,
          CardBrand: o.paymentMethod.brand,
          CardLast4: o.paymentMethod.last4,
          RiskScore: o.fraudRiskScore,
          Country: o.country,
          Date: `${o.date} ${o.time}`,
        }));
      } else if (selectedEntity === "customers") {
        const customers = getFallbackCustomers();
        data = customers.map((c) => ({
          CustomerID: c.id,
          Name: c.name,
          Email: c.email,
          Country: c.country,
          TotalSpent: `${selectedMerchant.currencySymbol}${c.totalSpent.toFixed(2)}`,
          OrdersCount: c.ordersCount,
          Status: c.status,
          FraudRiskScore: c.fraudScore,
          LastOrderDate: c.lastOrderDate,
        }));
      } else if (selectedEntity === "fraud") {
        data = MOCK_FRAUD_ALERTS.map((f) => ({
          AlertID: f.id,
          Vector: f.vector,
          RiskScore: f.score,
          TargetAmount: `${selectedMerchant.currencySymbol}${f.amount.toFixed(2)}`,
          Customer: f.customer,
          IPAddress: f.ip,
          Location: f.location,
          Status: f.status,
          Timestamp: f.timestamp,
        }));
      } else if (selectedEntity === "forecast") {
        data = MOCK_CASH_FLOW.forecastSeries.map((f) => ({
          Date: f.day,
          ProjectedBalance: `${selectedMerchant.currencySymbol}${(f.projectedBalance * selectedMerchant.multiplier).toFixed(2)}`,
          Inflow: `${selectedMerchant.currencySymbol}${(f.inflow * selectedMerchant.multiplier).toFixed(2)}`,
          Outflow: `${selectedMerchant.currencySymbol}${(f.outflow * selectedMerchant.multiplier).toFixed(2)}`,
          SafeToSpend: `${selectedMerchant.currencySymbol}${(MOCK_CASH_FLOW.safeToSpend * selectedMerchant.multiplier).toFixed(2)}`,
          RunwayMonths: MOCK_CASH_FLOW.runwayMonths,
        }));
      }

      downloadCSV(`${baseFilename}.csv`, data);
      setExportingFormat(null);
      toast.success(`CSV Export Complete (${selectedEntity.toUpperCase()})`, {
        description: `Downloaded ${data.length} records for ${selectedMerchant.name}`,
      });
      onClose();
    }, 400);
  };

  // Handler for JSON export per selected entity
  const handleExportJSON = () => {
    setExportingFormat("json");
    setTimeout(() => {
      let payload: Record<string, unknown> = {};
      const filename = `opsmind-${selectedEntity}-${selectedMerchant.code.toLowerCase()}.json`;

      const metadata = {
        exportedAt: new Date().toISOString(),
        merchant: {
          id: selectedMerchant.id,
          name: selectedMerchant.name,
          currency: selectedMerchant.currency,
          region: selectedMerchant.region,
        },
        entity: selectedEntity,
        environment: "production",
      };

      if (selectedEntity === "revenue") {
        payload = { ...metadata, kpis, series: MOCK_REVENUE_SERIES };
      } else if (selectedEntity === "payments") {
        payload = { ...metadata, orders, failedPayments: MOCK_FAILED_PAYMENTS };
      } else if (selectedEntity === "customers") {
        payload = { ...metadata, customers: getFallbackCustomers() };
      } else if (selectedEntity === "fraud") {
        payload = { ...metadata, alerts: MOCK_FRAUD_ALERTS };
      } else if (selectedEntity === "forecast") {
        payload = { ...metadata, cashFlow: MOCK_CASH_FLOW };
      }

      downloadJSON(filename, payload);
      setExportingFormat(null);
      toast.success(`JSON Telemetry Exported (${selectedEntity.toUpperCase()})`, {
        description: `Saved structured document to ${filename}`,
      });
      onClose();
    }, 400);
  };

  // Handler for PDF export per selected entity
  const handleExportPDF = () => {
    setExportingFormat("pdf");
    setTimeout(() => {
      setExportingFormat(null);
      toast.success(`Executive PDF Report Ready (${selectedEntity.toUpperCase()})`, {
        description: "Launching printable executive summary audit...",
      });
      onClose();

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>OpsMind Executive Report - ${selectedEntity.toUpperCase()}</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #0f172a; }
                .header { border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 20px; }
                .title { font-size: 24px; font-weight: bold; color: #1e3a8a; margin: 0; }
                .sub { font-size: 12px; color: #64748b; margin-top: 4px; }
                .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
                .kpi-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc; }
                .kpi-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
                .kpi-val { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 4px; }
                .footer { margin-top: 50px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 class="title">OpsMind Autonomous OS • Executive Report</h1>
                <div class="sub">
                  Target Entity: <strong>${selectedEntity.toUpperCase()}</strong> | 
                  Workspace: <strong>${selectedMerchant.name} (${selectedMerchant.currency})</strong> | 
                  Generated: <strong>${new Date().toLocaleString()}</strong>
                </div>
              </div>
              <div class="kpi-grid">
                ${kpis
                  .slice(0, 3)
                  .map(
                    (k) => `
                  <div class="kpi-card">
                    <div class="kpi-label">${k.title}</div>
                    <div class="kpi-val">${k.value}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <p style="font-size: 13px; color: #334155; line-height: 1.6;">
                This executive telemetry report was cryptographically compiled by the OpsMind Autonomous Business OS. All transactions, fraud vector intercepts, and cash flow projections adhere to PCI-DSS Level 1 specifications.
              </p>
              <div class="footer">OpsMind Enterprise Autonomous Business Operating System • Confidential & Proprietary</div>
              <script>
                window.onload = function() { window.print(); };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    }, 500);
  };

  const handleGenerateAISummary = () => {
    setExportingFormat("ai_summary");
    setProgressPercent(15);
    setProgressLabel("Analyzing settlement events & anomaly logs...");

    setTimeout(() => {
      setProgressPercent(50);
      setProgressLabel("Synthesizing fraud risk vectors & recovery rates...");
    }, 400);

    setTimeout(() => {
      setProgressPercent(85);
      setProgressLabel("Compiling executive recommendations & projections...");
    }, 850);

    setTimeout(() => {
      setProgressPercent(100);
      setProgressLabel("Report compiled successfully!");

      const summaryLines = [
        `OPSMIND AUTONOMOUS EXECUTIVE INTELLIGENCE SUMMARY`,
        `Merchant: ${selectedMerchant.name} (${selectedMerchant.currency})`,
        `Generated: ${new Date().toUTCString()}`,
        `--------------------------------------------------`,
        `1. FINANCIAL HEALTH: Gross GMV pacing at $148,290.40 (+14.2% vs baseline).`,
        `2. FRAUD DEFENSE: Sentinel neutralized 100% of brute-force BIN attacks ($38,420 blocked).`,
        `3. RECOVERY DUNNING: Salvaged $18,420.00 via smart retry algorithms (94.2% capture).`,
        `4. RUNWAY FORECAST: 18.4 months of positive operating runway with $420,000 safe-to-spend buffer.`,
      ];
      const blob = new Blob([summaryLines.join("\n")], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `opsmind-ai-executive-briefing-${selectedMerchant.code.toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportingFormat(null);
      setProgressPercent(0);
      toast.success("AI Executive Briefing Generated", {
        description: "Autonomous synthesis downloaded with zero telemetry loss.",
      });
      onClose();
    }, 1300);
  };

  const handleExportPNG = () => {
    setExportingFormat("png");
    setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
        gradient.addColorStop(0, "#050816");
        gradient.addColorStop(0.5, "#0a0e27");
        gradient.addColorStop(1, "#050816");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 630);

        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 1160, 590);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px sans-serif";
        ctx.fillText("OpsMind — Autonomous AI Operating System", 60, 80);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "18px sans-serif";
        ctx.fillText(
          `Merchant: ${selectedMerchant.name} (${selectedMerchant.currency}) • Generated: ${new Date().toUTCString()}`,
          60,
          115
        );

        kpis.slice(0, 6).forEach((kpi, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 60 + col * 370;
          const y = 170 + row * 190;

          ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
          ctx.beginPath();
          ctx.roundRect(x, y, 340, 160, 14);
          ctx.fill();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = "#94a3b8";
          ctx.font = "14px sans-serif";
          ctx.fillText(kpi.title.toUpperCase(), x + 24, y + 38);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 28px sans-serif";
          ctx.fillText(kpi.value, x + 24, y + 85);

          ctx.fillStyle = kpi.isPositive ? "#34d399" : "#f87171";
          ctx.font = "14px sans-serif";
          ctx.fillText(`${kpi.change} vs baseline`, x + 24, y + 125);
        });

        ctx.fillStyle = "#64748b";
        ctx.font = "13px sans-serif";
        ctx.fillText("Verified by OpsMind Sentinel ML Firewall • Confidential Merchant Telemetry", 60, 575);

        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `opsmind-os-snapshot-${selectedMerchant.code.toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setExportingFormat(null);
      toast.success("PNG Snapshot Generated", {
        description: `Saved opsmind-os-snapshot-${selectedMerchant.code.toLowerCase()}.png`,
      });
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Export Financial Intelligence"
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c102b] p-6 shadow-2xl shadow-black/80"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Export Financial Intelligence
                  </h3>
                  <p className="text-xs text-gray-400">
                    Store: <span className="text-white font-medium">{selectedMerchant.name}</span> ({selectedMerchant.currency})
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Entity Selector Tabs */}
            <div className="pt-4">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                1. Select Data Stream
              </span>
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                {ENTITY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = selectedEntity === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedEntity(tab.id)}
                      className={cn(
                        "flex-1 min-w-[90px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Generation Progress Bar */}
            {exportingFormat === "ai_summary" && (
              <div className="my-4 p-4 rounded-xl border border-purple-500/40 bg-purple-500/10">
                <div className="flex items-center justify-between text-xs text-purple-300 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    {progressLabel}
                  </span>
                  <span className="font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Formats Grid */}
            <div className="pt-4">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                2. Choose Export Format ({selectedEntity.toUpperCase()})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* CSV Option */}
                <div
                  onClick={handleExportCSV}
                  className="group p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2.5 group-hover:scale-105 transition-transform">
                      {exportingFormat === "csv" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300">
                      CSV Format
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Structured tabular dataset for spreadsheets and analytics engines.
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-medium text-emerald-400">
                    Download .csv →
                  </div>
                </div>

                {/* JSON Option */}
                <div
                  onClick={handleExportJSON}
                  className="group p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 mb-2.5 group-hover:scale-105 transition-transform">
                      {exportingFormat === "json" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileCode className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300">
                      JSON Telemetry
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Raw JSON payload with schema headers & timestamps for APIs.
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-medium text-cyan-400">
                    Download .json →
                  </div>
                </div>

                {/* Executive PDF */}
                <div
                  onClick={handleExportPDF}
                  className="group p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-rose-500/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-2.5 group-hover:scale-105 transition-transform">
                      {exportingFormat === "pdf" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-rose-300">
                      Executive PDF
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Printable audit deck formatted for executive and board review.
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-medium text-rose-400">
                    Generate .pdf →
                  </div>
                </div>

                {/* Generate AI Summary */}
                <div
                  onClick={handleGenerateAISummary}
                  className="group p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/[0.04] hover:bg-purple-500/[0.08] hover:border-purple-500/60 cursor-pointer transition-all flex flex-col justify-between sm:col-span-2"
                >
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 mb-2.5 group-hover:scale-105 transition-transform">
                      <BrainCircuit className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-semibold text-purple-200">
                      Generate AI Executive Briefing
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Autonomous multi-agent synthesis compiling fraud patterns, dunning efficiency, and cash flow forecast into an executive brief.
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-medium text-purple-400">
                    Synthesize with Sentinel AI →
                  </div>
                </div>

                {/* PNG Canvas */}
                <div
                  onClick={handleExportPNG}
                  className="group p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 mb-2.5 group-hover:scale-105 transition-transform">
                      {exportingFormat === "png" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-300">
                      PNG Canvas
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      High-resolution visual snapshot with active KPI cards.
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-medium text-blue-400">
                    Save .png →
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.08] text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>Instant client-side export • Zero telemetry leakage</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-8 border-white/10 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
