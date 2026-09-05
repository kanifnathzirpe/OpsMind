"use client";

import * as React from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Building2,
  Check,
  Shield,
  User,
  LogOut,
  RefreshCw,
  Layers,
  Settings,
  Bot,
  UserPlus,
  KeyRound,
  FileText,
  CreditCard,
  Menu,
  Users,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MOCK_MERCHANTS,
  MOCK_ORDERS,
  MOCK_FAILED_PAYMENTS,
  MOCK_FRAUD_ALERTS,
  Merchant,
} from "@/lib/dashboard-data";
import { getFallbackCustomers } from "@/lib/api/customers";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

import { NotificationDrawer } from "@/components/dashboard/notification-drawer";
import { useStore } from "@/store/use-store";

interface TopNavbarProps {
  className?: string;
  selectedMerchant: Merchant;
  onSelectMerchant: (merchant: Merchant) => void;
  onOpenCommandPalette: () => void;
  onOpenCopilot: () => void;
  onOpenInviteMembers?: () => void;
  onOpenSettingsTab?: (tab: string) => void;
  onToggleMobileSidebar?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  onToggleLoading?: () => void;
  isRealtimeActive?: boolean;
  onToggleRealtime?: () => void;
  onSelectTab?: (tab: string) => void;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim()) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-blue-500/30 text-blue-200 px-0.5 rounded font-semibold not-italic"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export function TopNavbar({
  className,
  selectedMerchant,
  onSelectMerchant,
  onOpenCommandPalette,
  onOpenCopilot,
  onOpenInviteMembers,
  onOpenSettingsTab,
  onToggleMobileSidebar,
  onRefresh,
  isLoading = false,
  onToggleLoading,
  isRealtimeActive = true,
  onToggleRealtime,
  onSelectTab,
}: TopNavbarProps) {
  const { user, logout, switchRole, role } = useAuth();
  const { setWorkspaceId } = useStore();
  const [isMerchantDropdownOpen, setIsMerchantDropdownOpen] = React.useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Global Search state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const unreadCount = useStore((s) => s.notificationCount);

  // Live global search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matchedOrders = MOCK_ORDERS.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    ).slice(0, 3);

    const customers = getFallbackCustomers();
    const matchedCustomers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    ).slice(0, 2);

    const matchedPayments = MOCK_FAILED_PAYMENTS.filter(
      (p) =>
        p.customer.toLowerCase().includes(q) ||
        p.declineReason.toLowerCase().includes(q) ||
        p.gateway.toLowerCase().includes(q)
    ).slice(0, 2);

    const matchedFraud = MOCK_FRAUD_ALERTS.filter(
      (f) =>
        f.vector.toLowerCase().includes(q) ||
        f.customer.toLowerCase().includes(q) ||
        f.ip.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q)
    ).slice(0, 2);

    const matchedCategories = [
      { id: "revenue", name: "Revenue Analytics", desc: "Settlement charts & gross volume" },
      { id: "fraud", name: "Fraud Sentinel", desc: "Attack vectors, TOR quarantine & risk radar" },
      { id: "forecast", name: "Cash Flow Forecast", desc: "30-day liquidity & burn rate runway" },
      { id: "payments", name: "Payments & Invoices", desc: "Smart retry dunning & decline codes" },
      { id: "customers", name: "Customer Accounts", desc: "Profiles, LTV & dispute health" },
      { id: "settings", name: "Settings & API Keys", desc: "Credentials, webhooks, security" },
    ].filter((c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));

    return {
      orders: matchedOrders,
      customers: matchedCustomers,
      payments: matchedPayments,
      fraud: matchedFraud,
      categories: matchedCategories,
    };
  }, [searchQuery]);

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      setIsMerchantDropdownOpen(false);
      setIsNotificationDrawerOpen(false);
      setIsProfileOpen(false);
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/[0.08]",
        "bg-[#070b19]/90 backdrop-blur-xl px-4 md:px-6 select-none",
        className
      )}
    >
      {/* Left Section: Mobile Menu, Merchant Switcher & Demo Mode indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMobileSidebar}
            className="lg:hidden h-8 w-8 text-gray-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        {/* Merchant Selector Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMerchantDropdownOpen(!isMerchantDropdownOpen);
              setIsNotificationDrawerOpen(false);
              setIsProfileOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] px-3 py-1.5 text-sm transition-all focus:outline-none"
          >
            <div className="h-6 w-6 rounded-md bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">
                {selectedMerchant.name}
              </div>
              <div className="text-[10px] text-gray-400">
                {selectedMerchant.region}
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1" />
          </button>

          {/* Merchant Dropdown Menu */}
          {isMerchantDropdownOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-white/[0.1] bg-[#0c1228] p-2 shadow-2xl shadow-black/80 backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2"
            >
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Select Active Merchant
              </div>
              <div className="space-y-1">
                {MOCK_MERCHANTS.map((m) => {
                  const isCurrent = m.id === selectedMerchant.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectMerchant(m);
                        setWorkspaceId(m.id);
                        setIsMerchantDropdownOpen(false);
                        toast.success(`Active workspace switched to: ${m.name} (${m.currency})`);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                        isCurrent
                          ? "bg-blue-600/20 text-white border border-blue-500/30"
                          : "text-gray-300 hover:bg-white/[0.05]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-md bg-white/[0.05] flex items-center justify-center text-gray-300 font-mono text-[11px]">
                          {m.currencySymbol}
                        </div>
                        <div>
                          <div className="font-medium text-white">{m.name}</div>
                          <div className="text-[10px] text-gray-400">
                            {m.region}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <Check className="h-4 w-4 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Demo Mode Toggle Badge */}
        {onToggleRealtime && (
          <button
            onClick={onToggleRealtime}
            className={cn(
              "hidden lg:flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-all border",
              isRealtimeActive
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            )}
            title="Toggle Continuous Demo Mode"
          >
            <span className="relative flex h-2 w-2">
              {isRealtimeActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  isRealtimeActive ? "bg-emerald-500" : "bg-gray-500"
                )}
              />
            </span>
            <span>{isRealtimeActive ? "Demo Mode: Active" : "Demo Mode: Paused"}</span>
          </button>
        )}
      </div>

      {/* Center Section: Interactive Global Search Bar */}
      <div
        ref={searchContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex-1 max-w-md hidden md:block"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search orders, customers, fraud, payments..."
            className="h-9 w-full rounded-xl border-white/[0.08] bg-white/[0.03] pl-9 pr-14 text-xs text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <button
            onClick={onOpenCommandPalette}
            className="absolute right-2 px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.06] text-[10px] font-mono text-gray-400 hover:text-white"
            title="Open Command Palette"
          >
            ⌘K
          </button>
        </div>

        {/* Global Search Dropdown */}
        {isSearchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-white/10 bg-[#0c1228] p-3 shadow-2xl shadow-black/80 backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2">
            {!searchQuery.trim() ? (
              <div className="space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Recent Searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["OPS-90121", "Quantum Dynamics", "Adyen EU", "BIN 400022"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSearchQuery(s)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300 hover:text-white hover:bg-white/[0.08]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Press ⌘K for complete command palette</span>
                  <kbd className="px-1 py-0.5 rounded bg-white/10 text-[9px] font-mono">ESC</kbd>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {/* Matched categories */}
                {searchResults?.categories && searchResults.categories.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Views & Analytics
                    </div>
                    {searchResults.categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectTab?.(c.id);
                          setIsSearchFocused(false);
                          setSearchQuery("");
                          toast.info(`Navigated to: ${c.name}`);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-white">
                            <HighlightMatch text={c.name} query={searchQuery} />
                          </div>
                          <div className="text-[10px] text-gray-400">
                            <HighlightMatch text={c.desc} query={searchQuery} />
                          </div>
                        </div>
                        <span className="text-[10px] text-blue-400">Open →</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Matched orders */}
                {searchResults?.orders && searchResults.orders.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      Orders & Transactions
                    </div>
                    {searchResults.orders.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => {
                          onSelectTab?.("payments");
                          setIsSearchFocused(false);
                          setSearchQuery("");
                          toast.info(`Inspecting Order: ${o.orderNumber}`);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-white">
                            <HighlightMatch text={o.orderNumber} query={searchQuery} /> • <HighlightMatch text={o.customerName} query={searchQuery} />
                          </div>
                          <div className="text-[10px] text-gray-400">
                            <HighlightMatch text={o.customerEmail} query={searchQuery} /> • {o.paymentMethod.brand.toUpperCase()} • {o.status}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-semibold text-white">
                          ${o.amount.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Matched customers */}
                {searchResults?.customers && searchResults.customers.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Customers</span>
                    </div>
                    {searchResults.customers.map((cust) => (
                      <button
                        key={cust.id}
                        onClick={() => {
                          onSelectTab?.("customers");
                          setIsSearchFocused(false);
                          setSearchQuery("");
                          toast.info(`Navigated to Customer: ${cust.name}`);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-white">
                            <HighlightMatch text={cust.name} query={searchQuery} />
                          </div>
                          <div className="text-[10px] text-gray-400">
                            <HighlightMatch text={cust.email} query={searchQuery} /> • {cust.country} • {cust.ordersCount} orders
                          </div>
                        </div>
                        <span className="text-xs font-mono text-cyan-400">
                          ${cust.totalSpent.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Matched fraud alerts */}
                {searchResults?.fraud && searchResults.fraud.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" />
                      <span>Fraud Alerts</span>
                    </div>
                    {searchResults.fraud.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          onSelectTab?.("fraud");
                          setIsSearchFocused(false);
                          setSearchQuery("");
                          toast.warning(`Inspecting Fraud Vector: ${f.vector}`);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-white">
                            <HighlightMatch text={f.vector} query={searchQuery} /> (Risk: {f.score})
                          </div>
                          <div className="text-[10px] text-gray-400">
                            <HighlightMatch text={f.customer} query={searchQuery} /> • <HighlightMatch text={f.ip} query={searchQuery} /> ({f.location})
                          </div>
                        </div>
                        <span className="text-xs font-mono text-rose-400">
                          ${f.amount.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Matched payments */}
                {searchResults?.payments && searchResults.payments.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      <span>Failed Payments Pending Recovery</span>
                    </div>
                    {searchResults.payments.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectTab?.("payments");
                          setIsSearchFocused(false);
                          setSearchQuery("");
                          toast.info(`Reviewing soft decline: ${p.customer}`);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-white">
                            <HighlightMatch text={p.customer} query={searchQuery} />
                          </div>
                          <div className="text-[10px] text-gray-400">
                            <HighlightMatch text={p.declineReason} query={searchQuery} /> • {p.gateway}
                          </div>
                        </div>
                        <span className="text-xs font-mono text-purple-400">
                          ${p.amount.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {(!searchResults ||
                  (searchResults.categories.length === 0 &&
                    searchResults.orders.length === 0 &&
                    searchResults.customers.length === 0 &&
                    searchResults.fraud.length === 0 &&
                    searchResults.payments.length === 0)) && (
                  <div className="py-4 text-center text-xs text-gray-400">
                    No matching records found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Actions, Notifications, Profile */}
      <div className="flex items-center gap-2">
        {/* Floating Copilot Quick Launcher Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCopilot}
          className="h-8 text-xs border-blue-500/30 bg-blue-600/15 text-blue-300 hover:bg-blue-600/25 flex items-center gap-1.5"
          title="Open AI Copilot (⌘J)"
        >
          <Bot className="h-3.5 w-3.5 text-blue-400" />
          <span className="hidden md:inline">AI Copilot</span>
          <kbd className="hidden sm:inline text-[9px] font-mono opacity-60">⌘J</kbd>
        </Button>

        {/* Skeleton loading toggle */}
        {onToggleLoading && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleLoading}
            className={cn(
              "h-8 text-xs border-white/10 hidden sm:flex items-center gap-1.5",
              isLoading
                ? "bg-blue-600/30 text-blue-300 border-blue-500/40"
                : "bg-white/[0.03] text-gray-400 hover:text-white"
            )}
            title="Toggle Skeleton View"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{isLoading ? "Loaded View" : "Skeleton View"}</span>
          </Button>
        )}

        {/* Live Refresh Button */}
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/[0.05]"
            title="Refresh telemetry"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        )}

        {/* Smart Notifications Center */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationDrawerOpen(true);
              setIsMerchantDropdownOpen(false);
              setIsProfileOpen(false);
            }}
            aria-label="Open notification center"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-[0_0_8px_#f43f5e]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Full Notification Center Drawer */}
          <NotificationDrawer
            isOpen={isNotificationDrawerOpen}
            onClose={() => setIsNotificationDrawerOpen(false)}
            onSelectTab={onSelectTab}
          />
        </div>

        {/* User Profile Menu (Part 9) */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileOpen(!isProfileOpen);
              setIsMerchantDropdownOpen(false);
              setIsNotificationDrawerOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] p-1.5 pr-2.5 transition-all focus:outline-none"
          >
            <div className="relative h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-semibold text-xs text-white shadow overflow-hidden">
              {user?.avatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatar} alt={user.name || "User"} className="h-full w-full object-cover" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : "U"
              )}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#070b19]" />
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-medium text-white leading-tight">
                {user?.name || "User"}
              </div>
              <div className="text-[10px] text-gray-400">{user?.role || "Member"}</div>
            </div>
            <ChevronDown className="h-3 w-3 text-gray-400 hidden md:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/[0.1] bg-[#0c1228] p-2 shadow-2xl shadow-black/80 backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2"
            >
              <div className="px-3 py-2 border-b border-white/[0.08]">
                <p className="text-xs font-semibold text-white">{user?.name || "User"}</p>
                <p className="text-[11px] text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[10px] text-blue-400">
                    <Shield className="h-3 w-3" />
                    <span>{role || user?.role || "Member"}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Role Switcher</span>
                </div>

                {/* Role Switcher Grid */}
                <div className="mt-2 grid grid-cols-4 gap-1">
                  {(["Admin", "Analyst", "Support", "Viewer"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors text-center border",
                        (role || user?.role) === r
                          ? "bg-blue-600/30 text-blue-300 border-blue-500/50 font-bold"
                          : "bg-white/[0.03] text-gray-400 border-white/[0.05] hover:text-white hover:bg-white/[0.08]"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    toast.info(`Account Profile: ${user?.name}`);
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.05] hover:text-white"
                >
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onOpenSettingsTab) {
                      onOpenSettingsTab("organization");
                    } else {
                      onSelectTab?.("settings");
                    }
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.05] hover:text-white"
                >
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  <span>Organization</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onOpenSettingsTab) {
                      onOpenSettingsTab("billing");
                    } else {
                      onSelectTab?.("settings");
                    }
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.05] hover:text-white"
                >
                  <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                  <span>Billing</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenInviteMembers?.();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-blue-400 hover:bg-blue-500/10"
                >
                  <UserPlus className="h-3.5 w-3.5 text-blue-400" />
                  <span>Invite Members</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onOpenSettingsTab) {
                      onOpenSettingsTab("apikeys");
                    } else {
                      onSelectTab?.("settings");
                    }
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.05] hover:text-white"
                >
                  <KeyRound className="h-3.5 w-3.5 text-gray-400" />
                  <span>API Keys</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onOpenSettingsTab) {
                      onOpenSettingsTab("notifications");
                    } else {
                      onSelectTab?.("settings");
                    }
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.05] hover:text-white"
                >
                  <Settings className="h-3.5 w-3.5 text-gray-400" />
                  <span>Preferences</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsMerchantDropdownOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.05] hover:text-white"
                >
                  <Layers className="h-3.5 w-3.5 text-gray-400" />
                  <span>Switch Workspace</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    toast.info("Documentation opened: https://docs.opsmind.io");
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:bg-white/[0.05] hover:text-white"
                >
                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                  <span>Documentation</span>
                </button>
              </div>

              <div className="border-t border-white/[0.08] pt-1 mt-1">
                <button
                  onClick={async () => {
                    setIsProfileOpen(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}