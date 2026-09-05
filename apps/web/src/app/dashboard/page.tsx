"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card";
import { FraudAlertsPanel } from "@/components/dashboard/fraud-alerts-panel";
import { FailedPaymentsPanel } from "@/components/dashboard/failed-payments-panel";
import { RecentActivityTimeline } from "@/components/dashboard/recent-activity-timeline";
import { DashboardSkeleton, ChartSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ErrorState } from "@/components/dashboard/error-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { SessionTimeoutModal } from "@/components/security/session-timeout-modal";
import { AdvancedFilterBar } from "@/components/dashboard/advanced-filter-bar";
import { useRealtimeEngine } from "@/hooks/use-realtime-engine";
import { useStore } from "@/store/use-store";
import {
  useDashboardQuery,
  useRevenueSeriesQuery,
  useForecastQuery,
  useFraudQuery,
  usePaymentsQuery,
  useRefundOrderMutation,
  useRetryPaymentMutation,
  useApplyFraudRuleMutation,
} from "@/hooks/queries/use-dashboard-queries";
import {
  MOCK_REVENUE_SERIES,
  MOCK_AI_INSIGHTS,
  MOCK_CASH_FLOW,
  MOCK_FRAUD_ALERTS,
  MOCK_FAILED_PAYMENTS,
  OrderItem,
} from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  Sparkles,
  Bot,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

// Dynamic imports with lazy loading for modals, drawers & heavy charts
const RevenueChart = dynamic(
  () => import("@/components/dashboard/revenue-chart").then((mod) => mod.RevenueChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

const CashFlowForecast = dynamic(
  () => import("@/components/dashboard/cash-flow-forecast").then((mod) => mod.CashFlowForecast),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

const CommandPalette = dynamic(
  () =>
    import("@/components/dashboard/command-palette").then(
      (mod) => mod.CommandPalette
    ),
  { ssr: false }
);

const CopilotDrawer = dynamic(
  () =>
    import("@/components/dashboard/copilot-drawer").then(
      (mod) => mod.CopilotDrawer
    ),
  { ssr: false }
);

const ExportModal = dynamic(
  () =>
    import("@/components/dashboard/export-modal").then(
      (mod) => mod.ExportModal
    ),
  { ssr: false }
);

const SettingsModal = dynamic(
  () =>
    import("@/components/dashboard/settings-modal").then(
      (mod) => mod.SettingsModal
    ),
  { ssr: false }
);

const LiveAIEventBanner = dynamic(
  () =>
    import("@/components/dashboard/live-ai-event-banner").then(
      (mod) => mod.LiveAIEventBanner
    ),
  { ssr: false }
);

const InviteMembersModal = dynamic(
  () =>
    import("@/components/dashboard/invite-members-modal").then(
      (mod) => mod.InviteMembersModal
    ),
  { ssr: false }
);

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedKpi, setSelectedKpi] = React.useState<string | undefined>();
  const [dateRange, setDateRange] = React.useState("Last 30 Days");

  // Global modals and drawers state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = React.useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [isSettingsManualOpen, setIsSettingsManualOpen] = React.useState(false);
  const [isInviteMembersOpen, setIsInviteMembersOpen] = React.useState(false);
  const [selectedDrawerOrder, setSelectedDrawerOrder] = React.useState<OrderItem | null>(null);

  // Store filters & persistence
  const { advancedFilters, setAdvancedFilters, resetAdvancedFilters } = useStore();

  const isSettingsModalOpen = activeTab === "settings" || isSettingsManualOpen;

  // Realtime WebSocket state engine with 4-second live event simulator
  const {
    selectedMerchant,
    setSelectedMerchant,
    isRealtimeActive,
    setIsRealtimeActive,
    orders,
    activities,
    kpis,
    lastUpdatedKpiId,
    lastUpdatedType,
    handleRefundOrder,
    handleRecoveredAmount,
  } = useRealtimeEngine();

  // Centralized TanStack Query hooks fetching through the API layer
  const {
    data: dashboardData,
    refetch: refetchDashboard,
  } = useDashboardQuery(selectedMerchant.id);

  const {
    data: revenueSeriesData,
    isError: isRevenueError,
    refetch: refetchRevenue,
  } = useRevenueSeriesQuery(dateRange);

  const {
    data: forecastData,
    isError: isForecastError,
    refetch: refetchForecast,
  } = useForecastQuery();

  const {
    data: fraudAlertsData,
    isError: isFraudError,
    refetch: refetchFraud,
  } = useFraudQuery();

  const {
    data: failedPaymentsData,
    isError: isPaymentsError,
    refetch: refetchPayments,
  } = usePaymentsQuery();

  // Optimistic mutations
  const refundOrderMutation = useRefundOrderMutation(selectedMerchant.id);
  const retryPaymentMutation = useRetryPaymentMutation();
  const applyFraudRuleMutation = useApplyFraudRuleMutation();

  // Multi-dimensional filtered orders list with memoization
  const filteredOrders = React.useMemo(() => {
    let list = [...orders];

    if (advancedFilters.status && advancedFilters.status !== "all") {
      list = list.filter((o) => o.status === advancedFilters.status);
    }
    if (advancedFilters.currency && advancedFilters.currency !== "all") {
      list = list.filter((o) => o.currency === advancedFilters.currency);
    }
    if (advancedFilters.minAmount !== undefined) {
      list = list.filter((o) => o.amount >= advancedFilters.minAmount!);
    }
    if (advancedFilters.maxAmount !== undefined) {
      list = list.filter((o) => o.amount <= advancedFilters.maxAmount!);
    }
    if (advancedFilters.riskLevel && advancedFilters.riskLevel !== "all") {
      list = list.filter((o) => o.riskLevel === advancedFilters.riskLevel);
    }
    return list;
  }, [orders, advancedFilters]);

  // Global Keyboard shortcuts: ⌘K / Ctrl+K, ⌘J / Ctrl+J, and Esc
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "/" && !isInput) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsCopilotOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setIsCopilotOpen(false);
        setIsExportModalOpen(false);
        setIsSettingsManualOpen(false);
        setIsInviteMembersOpen(false);
        setSelectedDrawerOrder(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    toast.info("Syncing multi-currency ledger & AI sentinel models...");
    try {
      await Promise.allSettled([
        refetchDashboard(),
        refetchRevenue(),
        refetchForecast(),
        refetchFraud(),
        refetchPayments(),
      ]);
      toast.success("Dashboard metrics updated successfully");
    } catch {
      toast.info("Cached multi-rail telemetry loaded");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeCycle = () => {
    const ranges = ["Last 30 Days", "Today", "Last 7 Days", "Last 90 Days"];
    const nextIdx = (ranges.indexOf(dateRange) + 1) % ranges.length;
    const nextRange = ranges[nextIdx];
    setDateRange(nextRange);
    toast.info(`Timeframe filtered to: ${nextRange}`);
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={(tab) => {
        if (tab === "settings") {
          setIsSettingsManualOpen(true);
        } else {
          router.push(`/dashboard?tab=${tab}`);
        }
        if (tab === "copilot") {
          setIsCopilotOpen(true);
        }
      }}
      selectedMerchant={selectedMerchant}
      onSelectMerchant={setSelectedMerchant}
      onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      onOpenCopilot={() => setIsCopilotOpen(true)}
      onOpenInviteMembers={() => setIsInviteMembersOpen(true)}
      onOpenSettingsTab={() => setIsSettingsManualOpen(true)}
      onRefresh={handleRefresh}
      isLoading={isLoading}
      onToggleLoading={() => setIsLoading((prev) => !prev)}
      isRealtimeActive={isRealtimeActive}
      onToggleRealtime={() => {
        setIsRealtimeActive(!isRealtimeActive);
        toast.info(
          !isRealtimeActive ? "Realtime live ticker resumed (4s pulse)" : "Realtime ticker paused"
        );
      }}
    >
      {/* Non-intrusive Offline Connection Status Banner */}
      <OfflineBanner />

      {/* Enterprise Session Timeout Guard */}
      <SessionTimeoutModal />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6 pb-12">
          {/* Subheader Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {activeTab === "overview" && "Autonomous Business OS"}
                  {activeTab === "revenue" && "Revenue & Settlement Analytics"}
                  {activeTab === "fraud" && "Fraud Sentinel & Risk Control"}
                  {activeTab === "payments" && "Multi-Rail Payments & Retries"}
                  {activeTab === "forecast" && "Predictive Cash Flow & Treasury"}
                  {activeTab === "copilot" && "AI Copilot Command Center"}
                  {activeTab === "customers" && "Merchant Customers & Accounts"}
                  {activeTab === "settings" && "Workspace & Gateway Settings"}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs text-blue-400">
                  <Sparkles className="h-3 w-3" />
                  <span>Realtime 4s Stream</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Connected: Stripe US, Adyen EU, Braintree Global • Store:{" "}
                <span className="text-white font-medium">{selectedMerchant.name}</span> (
                {selectedMerchant.currency})
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Date Range Selector */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDateRangeCycle}
                className="h-8 text-xs border-white/10 bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.06]"
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                <span>{dateRange}</span>
              </Button>

              {/* Generate Report Button - triggers ExportModal */}
              <Button
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-900/30"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                <span>Export Report</span>
              </Button>

              {/* Quick Settings Icon */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSettingsManualOpen(true)}
                className="h-8 w-8 border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06]"
                title="Open Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Section 3: KPI Cards (6 Cards with smooth animations & live flash) */}
          <ErrorBoundary name="KPI Metrics">
            <section id="kpi-cards" aria-label="KPI Metrics">
              <KPICards
                kpis={kpis}
                selectedMetricId={selectedKpi}
                currencySymbol={selectedMerchant.currencySymbol}
                multiplier={selectedMerchant.multiplier}
                lastUpdatedKpiId={lastUpdatedKpiId}
                lastUpdatedType={lastUpdatedType}
                onSelectMetric={(id) => {
                  setSelectedKpi(id === selectedKpi ? undefined : id);
                  toast.info(`Filtered telemetry for: ${id.replace("_", " ")}`);
                }}
              />
            </section>
          </ErrorBoundary>

          {/* Section 4 & 6: Revenue Chart + AI Insights Card */}
          {(activeTab === "overview" || activeTab === "revenue" || activeTab === "copilot") && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Section 4: Revenue Chart (2 Columns) */}
              <ErrorBoundary name="Revenue Analytics" className="lg:col-span-2">
                <section
                  id="revenue-chart"
                  aria-label="Revenue Chart"
                  className="lg:col-span-2"
                >
                  {isRevenueError ? (
                    <ErrorState
                      title="Revenue Telemetry Offline"
                      message="Unable to refresh revenue metrics from the ledger. Click below to retry."
                      onRetry={() => refetchRevenue()}
                    />
                  ) : (
                    <RevenueChart
                      data={revenueSeriesData || dashboardData?.revenueSeries || MOCK_REVENUE_SERIES}
                      currencySymbol={selectedMerchant.currencySymbol}
                    />
                  )}
                </section>
              </ErrorBoundary>

              {/* Section 6: AI Insights Card (1 Column) */}
              <ErrorBoundary name="AI Insights">
                <section id="ai-insights" aria-label="AI Insights">
                  <AIInsightsCard
                    insights={MOCK_AI_INSIGHTS}
                    onOpenCopilot={() => setIsCopilotOpen(true)}
                  />
                </section>
              </ErrorBoundary>
            </div>
          )}

          {/* Section 5: Orders Table + Advanced Multi-Dimensional Filter Bar */}
          {(activeTab === "overview" || activeTab === "payments" || activeTab === "customers") && (
            <ErrorBoundary name="Orders and Transactions Ledger">
              <section id="orders-table" aria-label="Orders Table" className="space-y-4">
                <AdvancedFilterBar
                  filters={advancedFilters}
                  onFilterChange={setAdvancedFilters}
                  onResetFilters={resetAdvancedFilters}
                  resultsCount={filteredOrders.length}
                />
                <OrdersTable
                  orders={filteredOrders}
                  currencySymbol={selectedMerchant.currencySymbol}
                  selectedOrder={selectedDrawerOrder}
                  onSelectOrder={setSelectedDrawerOrder}
                  onRefundOrder={(orderId) => {
                    handleRefundOrder(orderId);
                    refundOrderMutation.mutate(orderId);
                  }}
                />
              </section>
            </ErrorBoundary>
          )}

          {/* Section 7, 8, 9: Cash Flow Forecast + Fraud Alerts + Failed Payments */}
          {(activeTab === "overview" || activeTab === "fraud" || activeTab === "forecast" || activeTab === "payments") && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Section 7: Cash Flow Forecast Card */}
              <ErrorBoundary name="Cash Flow Forecast">
                <section id="cash-flow" aria-label="Cash Flow Forecast">
                  {isForecastError ? (
                    <ErrorState
                      title="Treasury Forecast Offline"
                      message="Failed to retrieve liquidity projections. Click below to reconnect."
                      onRetry={() => refetchForecast()}
                    />
                  ) : (
                    <CashFlowForecast
                      data={forecastData || dashboardData?.cashFlow || MOCK_CASH_FLOW}
                    />
                  )}
                </section>
              </ErrorBoundary>

              {/* Section 8: Fraud Alerts Panel */}
              <ErrorBoundary name="Sentinel Firewall">
                <section id="fraud-alerts" aria-label="Fraud Alerts">
                  {isFraudError ? (
                    <ErrorState
                      title="Sentinel Firewall Feed Interrupted"
                      message="Failed to query active risk vectors. Click below to reconnect."
                      onRetry={() => refetchFraud()}
                    />
                  ) : (
                    <FraudAlertsPanel
                      alerts={fraudAlertsData || dashboardData?.fraudAlerts || MOCK_FRAUD_ALERTS}
                    />
                  )}
                </section>
              </ErrorBoundary>

              {/* Section 9: Failed Payments Panel */}
              <ErrorBoundary name="Payment Recovery">
                <section id="failed-payments" aria-label="Failed Payments">
                  {isPaymentsError ? (
                    <ErrorState
                      title="Payment Rail Offline"
                      message="Failed to load soft-decline transactions. Click below to retry."
                      onRetry={() => refetchPayments()}
                    />
                  ) : (
                    <FailedPaymentsPanel
                      payments={failedPaymentsData || MOCK_FAILED_PAYMENTS}
                      onPaymentRecovered={(amount) => {
                        handleRecoveredAmount(amount);
                        retryPaymentMutation.reset();
                      }}
                    />
                  )}
                </section>
              </ErrorBoundary>
            </div>
          )}

          {/* Section 10: Recent Activity Timeline */}
          <ErrorBoundary name="Activity Timeline">
            <section id="activity-timeline" aria-label="Recent Activity">
              <RecentActivityTimeline activities={activities} />
            </section>
          </ErrorBoundary>
        </div>
      )}

      {/* Floating Copilot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 p-3.5 text-white shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all duration-200"
          title="Launch OpsMind Copilot (⌘J)"
        >
          <Bot className="h-5 w-5 animate-pulse" />
          <span className="font-semibold text-xs tracking-wide pr-1 hidden sm:inline">
            OpsMind Copilot
          </span>
          <kbd className="hidden md:inline rounded bg-white/20 px-1 py-0.2 text-[9px] font-mono">
            ⌘J
          </kbd>
        </button>
      </div>

      {/* Command Palette Modal (CMD+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          if (tab === "settings") {
            setIsSettingsManualOpen(true);
          } else {
            router.push(`/dashboard?tab=${tab}`);
          }
          if (tab === "copilot") setIsCopilotOpen(true);
        }}
        onSelectMerchant={setSelectedMerchant}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onToggleSkeleton={() => setIsLoading((prev) => !prev)}
        onOpenSettings={() => setIsSettingsManualOpen(true)}
        onSelectOrder={setSelectedDrawerOrder}
        selectedMerchant={selectedMerchant}
      />

      {/* Floating AI Copilot Drawer (⌘J) */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onExecuteAction={(action) => {
          if (action === "batch_recover") {
            handleRecoveredAmount(12030.5);
            toast.success("AI recovered $12,030.50 into Treasury balance");
          } else if (action === "export_pdf") {
            setIsExportModalOpen(true);
          } else {
            applyFraudRuleMutation.mutate({ ruleId: action, ruleName: action });
          }
        }}
      />

      {/* Export Intelligence Modal (CSV, PDF, PNG) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        kpis={kpis}
        orders={orders}
        selectedMerchant={selectedMerchant}
      />

      {/* Settings Modal (Theme, Notifications, Org, Billing, Danger Zone) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsManualOpen(false);
          if (activeTab === "settings") {
            router.push("/dashboard?tab=overview");
          }
        }}
        selectedMerchant={selectedMerchant}
      />

      {/* Invite Operations Members Modal */}
      <InviteMembersModal
        isOpen={isInviteMembersOpen}
        onClose={() => setIsInviteMembersOpen(false)}
      />

      {/* Floating Realtime AI System Layer (Top-Right Live Events) */}
      <LiveAIEventBanner isVisible={isRealtimeActive} />
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </React.Suspense>
  );
}