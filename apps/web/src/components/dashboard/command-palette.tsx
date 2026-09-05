"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  ShieldAlert,
  CreditCard,
  LineChart,
  Bot,
  Users,
  Settings,
  Download,
  Building2,
  Sun,
  Moon,
  ToggleLeft,
  RotateCcw,
  FileText,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_MERCHANTS, MOCK_ORDERS, MOCK_FRAUD_ALERTS, Merchant, OrderItem } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onSelectMerchant: (merchant: Merchant) => void;
  onOpenCopilot: () => void;
  onOpenExport: () => void;
  onToggleSkeleton: () => void;
  onOpenSettings?: () => void;
  onSelectOrder?: (order: OrderItem) => void;
  selectedMerchant?: Merchant;
}

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "Preferences" | "Merchants" | "Orders" | "Fraud Alerts";
  icon: React.ComponentType<{ className?: string }>;
  hotkey?: string;
  action: () => void;
  subtitle?: string;
  keywords?: string[];
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onSelectMerchant,
  onOpenCopilot,
  onOpenExport,
  onToggleSkeleton,
  onOpenSettings,
  onSelectOrder,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input and reset when opened
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setSelectedIndex(0);
        setQuery("");
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Build command list
  const commands: CommandItem[] = React.useMemo(() => {
    const list: CommandItem[] = [
      // Navigation
      {
        id: "nav-revenue",
        title: "Open Revenue",
        category: "Navigation",
        icon: TrendingUp,
        hotkey: "G R",
        subtitle: "Gross volume, multi-gateway settlement telemetry, and auth rates",
        keywords: ["open revenue", "revenue", "analytics", "sales", "settlements"],
        action: () => {
          onSelectTab("revenue");
          onClose();
        },
      },
      {
        id: "nav-fraud",
        title: "Open Fraud",
        category: "Navigation",
        icon: ShieldAlert,
        hotkey: "G F",
        subtitle: "Sentinel firewall, velocity probe quarantine, risk radar",
        keywords: ["open fraud", "fraud", "sentinel", "risk", "security", "threats"],
        action: () => {
          onSelectTab("fraud");
          onClose();
        },
      },
      {
        id: "nav-forecast",
        title: "Open Forecast",
        category: "Navigation",
        icon: LineChart,
        hotkey: "G C",
        subtitle: "Predictive cash flow modeling and runway analytics",
        keywords: ["open forecast", "forecast", "cash", "runway", "treasury"],
        action: () => {
          onSelectTab("forecast");
          onClose();
        },
      },
      {
        id: "nav-copilot",
        title: "Open Copilot",
        category: "Navigation",
        icon: Bot,
        hotkey: "⌘J",
        subtitle: "Autonomous conversational AI operator for business intelligence",
        keywords: ["open copilot", "copilot", "ai", "chat", "assistant", "bot"],
        action: () => {
          onClose();
          onOpenCopilot();
        },
      },
      {
        id: "nav-payments",
        title: "Open Payments",
        category: "Navigation",
        icon: CreditCard,
        hotkey: "G P",
        subtitle: "Transaction logs, smart-retries, dunning schedule",
        keywords: ["open payments", "payments", "cards", "charges", "retries"],
        action: () => {
          onSelectTab("payments");
          onClose();
        },
      },
      {
        id: "nav-customers",
        title: "Search Customer / Open Customers",
        category: "Navigation",
        icon: Users,
        hotkey: "G U",
        subtitle: "Customer accounts, lifetime value, and dispute ratio",
        keywords: ["search customer", "customers", "users", "accounts", "open customers"],
        action: () => {
          onSelectTab("customers");
          onClose();
        },
      },
      {
        id: "nav-settings",
        title: "Open Settings",
        category: "Navigation",
        icon: Settings,
        hotkey: "G S",
        subtitle: "Theme, webhooks, organization, billing, and danger zone",
        keywords: ["open settings", "settings", "config", "billing", "organization", "danger zone"],
        action: () => {
          onClose();
          if (onOpenSettings) {
            onOpenSettings();
          } else {
            onSelectTab("settings");
          }
        },
      },

      // Actions
      {
        id: "act-export-report",
        title: "Export Report",
        category: "Actions",
        icon: Download,
        subtitle: "Export dashboard data in CSV, Executive PDF, or Canvas PNG format",
        keywords: ["export report", "export", "download", "csv", "pdf", "png", "report"],
        action: () => {
          onClose();
          onOpenExport();
        },
      },
      {
        id: "act-toggle-skeleton",
        title: "Toggle Skeleton Loading State",
        category: "Actions",
        icon: ToggleLeft,
        subtitle: "Switch between live telemetry and loading skeleton preview",
        keywords: ["toggle skeleton", "skeleton", "loading", "shimmer", "preview"],
        action: () => {
          onToggleSkeleton();
          onClose();
        },
      },
      {
        id: "act-retry-failed",
        title: "Retry Failed Payments",
        category: "Actions",
        icon: RotateCcw,
        subtitle: "Execute automated multi-rail dunning batch across soft declines",
        keywords: ["retry failed payments", "retry", "failed", "dunning", "payments"],
        action: () => {
          toast.success("AI Smart Retry Executed", {
            description: "Queued 4 recoverable subscriptions across Stripe & Adyen",
          });
          onClose();
        },
      },
      {
        id: "act-generate-summary",
        title: "Generate Summary",
        category: "Actions",
        icon: FileText,
        subtitle: "Autonomous multi-agent briefing synthesizing revenue, fraud, and runway",
        keywords: ["generate summary", "summary", "briefing", "report", "ai"],
        action: () => {
          onClose();
          onOpenCopilot();
        },
      },
      {
        id: "act-live-mode",
        title: "Live Mode / Demo Stream",
        category: "Actions",
        icon: Activity,
        subtitle: "Toggle continuous 4-second multi-gateway WebSocket simulation",
        keywords: ["live mode", "demo mode", "websocket", "stream", "realtime"],
        action: () => {
          toast.success("Live Mode active (4-second telemetry stream)");
          onClose();
        },
      },
      {
        id: "act-recent-orders",
        title: "Recent Orders",
        category: "Navigation",
        icon: CreditCard,
        subtitle: "View complete ledger of incoming transactions and authorization status",
        keywords: ["recent orders", "orders", "transactions", "ledger"],
        action: () => {
          onSelectTab("payments");
          onClose();
        },
      },

      // Preferences / Themes
      {
        id: "pref-dark-mode",
        title: "Dark Mode",
        category: "Preferences",
        icon: Moon,
        subtitle: "Deep space obsidian palette (#050816) with blue glow accents",
        keywords: ["dark mode", "dark", "theme", "night", "black"],
        action: () => {
          toast.success("Dark Mode active", { description: "High-contrast obsidian theme applied." });
          onClose();
        },
      },
      {
        id: "pref-light-mode",
        title: "Light Mode",
        category: "Preferences",
        icon: Sun,
        subtitle: "High-visibility daytime contrast canvas",
        keywords: ["light mode", "light", "day", "theme", "white"],
        action: () => {
          toast.info("Light Mode previewed", { description: "Optimized for sunlight visibility with OLED dark preservation." });
          onClose();
        },
      },

      // Merchants
      ...MOCK_MERCHANTS.map((m) => ({
        id: `merch-${m.id}`,
        title: `Switch Merchant: ${m.name}`,
        category: "Merchants" as const,
        icon: Building2,
        subtitle: `${m.region} • ${m.currency} currency`,
        keywords: ["merchant", "store", m.name.toLowerCase(), m.currency.toLowerCase()],
        action: () => {
          onSelectMerchant(m);
          toast.info(`Switched active store to: ${m.name}`);
          onClose();
        },
      })),

      // Orders Search
      ...MOCK_ORDERS.map((o) => ({
        id: `order-${o.id}`,
        title: `Search Order: ${o.orderNumber} - ${o.customerName}`,
        category: "Orders" as const,
        icon: CreditCard,
        subtitle: `${o.customerEmail} • $${o.amount.toFixed(2)} • ${o.status.toUpperCase()}`,
        keywords: ["search order", "order", o.orderNumber.toLowerCase(), o.customerName.toLowerCase(), o.customerEmail.toLowerCase()],
        action: () => {
          onSelectOrder?.(o);
          onClose();
        },
      })),

      // Fraud Alerts Search
      ...MOCK_FRAUD_ALERTS.map((f) => ({
        id: `fraud-${f.id}`,
        title: `Fraud Alert: ${f.vector} (Score: ${f.score})`,
        category: "Fraud Alerts" as const,
        icon: ShieldAlert,
        subtitle: `${f.customer} • ${f.location} • $${f.amount.toFixed(2)}`,
        keywords: ["fraud", "alert", "threat", f.vector.toLowerCase(), f.customer.toLowerCase(), f.ip],
        action: () => {
          onSelectTab("fraud");
          toast.warning(`Inspecting Fraud Alert: ${f.vector}`, {
            description: `Targeting customer ${f.customer} with risk score ${f.score}/100`,
          });
          onClose();
        },
      })),
    ];

    return list;
  }, [
    onSelectTab,
    onClose,
    onOpenCopilot,
    onOpenExport,
    onToggleSkeleton,
    onOpenSettings,
    onSelectMerchant,
    onSelectOrder,
  ]);

  // Fuzzy filter commands based on search query
  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase().trim();

    return commands.filter((cmd) => {
      const matchTitle = cmd.title.toLowerCase().includes(lower);
      const matchSubtitle = cmd.subtitle?.toLowerCase().includes(lower);
      const matchCategory = cmd.category.toLowerCase().includes(lower);
      const matchKeywords = cmd.keywords?.some((k) => k.includes(lower));
      return matchTitle || matchSubtitle || matchCategory || matchKeywords;
    });
  }, [commands, query]);

  const activeIndex = Math.min(selectedIndex, Math.max(0, filteredCommands.length - 1));

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
      );
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else {
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[activeIndex]) {
        filteredCommands[activeIndex].action();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c102b] shadow-2xl shadow-black/90 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-label="OpsMind Command Palette"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-black/40">
              <Search className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search (e.g. 'Open Revenue', 'Export Report', 'Dark Mode')..."
                className="h-7 border-0 bg-transparent p-0 text-sm text-white placeholder:text-gray-400 focus-visible:ring-0 shadow-none"
              />
              <kbd className="hidden sm:inline rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-gray-400">
                ESC
              </kbd>
            </div>

            {/* Command List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  No matching commands found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === activeIndex;

                  return (
                    <div
                      key={cmd.id}
                      onClick={() => cmd.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                        isSelected
                          ? "bg-blue-600/20 text-white border border-blue-500/30"
                          : "text-gray-300 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg border",
                            isSelected
                              ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                              : "bg-white/[0.03] border-white/10 text-gray-400"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white truncate">
                              {cmd.title}
                            </span>
                            <span className="text-[9px] rounded px-1.5 py-0.2 bg-white/5 border border-white/10 text-gray-400 uppercase">
                              {cmd.category}
                            </span>
                          </div>
                          {cmd.subtitle && (
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                              {cmd.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {cmd.hotkey && (
                        <kbd className="hidden sm:inline rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-gray-300">
                          {cmd.hotkey}
                        </kbd>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Palette Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.08] bg-black/40 text-[11px] text-gray-400">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono">↑</kbd>{" "}
                  <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono">↓</kbd> navigate
                </span>
                <span>
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">↵</kbd> select
                </span>
              </div>
              <span className="text-[10px] text-blue-400">
                OpsMind Global Command Dispatcher
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
