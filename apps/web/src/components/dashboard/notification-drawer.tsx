"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Archive,
  Trash2,
  ShieldAlert,
  CreditCard,
  TrendingUp,
  Bot,
  Activity,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationItem, MOCK_NOTIFICATIONS } from "@/lib/dashboard-data";
import { useStore } from "@/store/use-store";
import { toast } from "sonner";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
}

type NotificationCategory = "all" | "fraud" | "recovery" | "revenue" | "ai" | "system";

const CATEGORY_TABS: { id: NotificationCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "fraud", label: "Fraud", icon: ShieldAlert },
  { id: "recovery", label: "Payments", icon: CreditCard },
  { id: "revenue", label: "Revenue", icon: TrendingUp },
  { id: "ai", label: "AI", icon: Bot },
  { id: "system", label: "System", icon: Activity },
];

export function NotificationDrawer({
  isOpen,
  onClose,
  onSelectTab,
}: NotificationDrawerProps) {
  const [activeCategory, setActiveCategory] = React.useState<NotificationCategory>("all");
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const {
    archivedNotificationIds,
    archiveNotification,
    deletedNotificationIds,
    deleteNotification,
    setNotificationCount,
  } = useStore();

  // Filter out deleted notifications
  const visibleNotifications = React.useMemo(() => {
    return notifications.filter((n) => !deletedNotificationIds.includes(n.id));
  }, [notifications, deletedNotificationIds]);

  // Filter by category
  const filteredList = React.useMemo(() => {
    if (activeCategory === "all") return visibleNotifications;
    return visibleNotifications.filter((n) => n.category === activeCategory);
  }, [visibleNotifications, activeCategory]);

  // Chronological grouping
  const groupedNotifications = React.useMemo(() => {
    const groups: { Today: NotificationItem[]; Yesterday: NotificationItem[]; Earlier: NotificationItem[] } = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    filteredList.forEach((item) => {
      const lower = item.time.toLowerCase();
      if (lower.includes("yesterday") || lower.includes("1d")) {
        groups.Yesterday.push(item);
      } else if (lower.includes("2d") || lower.includes("3d") || lower.includes("earlier") || lower.includes("week")) {
        groups.Earlier.push(item);
      } else {
        groups.Today.push(item);
      }
    });

    return groups;
  }, [filteredList]);

  const unreadCount = visibleNotifications.filter((n) => !n.read && !archivedNotificationIds.includes(n.id)).length;

  React.useEffect(() => {
    setNotificationCount(unreadCount);
  }, [unreadCount, setNotificationCount]);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleMarkItemRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    archiveNotification(id);
    toast.info("Notification moved to archive");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
    toast.info("Notification removed");
  };

  const handleClickItem = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );

    if (item.category === "fraud") onSelectTab?.("fraud");
    else if (item.category === "recovery") onSelectTab?.("payments");
    else if (item.category === "revenue") onSelectTab?.("revenue");
    else if (item.category === "ai") onSelectTab?.("copilot");

    onClose();
    toast.info(`Navigated to: ${item.title}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fraud":
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case "recovery":
        return <CreditCard className="h-4 w-4 text-emerald-400" />;
      case "revenue":
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case "ai":
        return <Bot className="h-4 w-4 text-purple-400" />;
      default:
        return <Activity className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-[#080d1e] border-l border-white/10 shadow-2xl flex flex-col text-white"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold tracking-tight">Notification Center</h2>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Multi-rail telemetry & autonomous alerts</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleMarkAllRead}
                    className="h-8 px-2 text-xs text-gray-400 hover:text-white"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5 mr-1 text-blue-400" />
                    <span>Read all</span>
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="h-8 w-8 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CATEGORY_TABS.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeCategory === tab.id;
                const count =
                  tab.id === "all"
                    ? visibleNotifications.length
                    : visibleNotifications.filter((n) => n.category === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <TabIcon className="h-3 w-3" />
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full",
                        isActive ? "bg-white/20 text-white" : "bg-white/[0.06] text-gray-400"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Notification Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center select-none">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-gray-400 mb-3">
                    <CheckCheck className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">All Caught Up</h4>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">
                    Zero unread alerts in {activeCategory.toUpperCase()}. All multi-rail gateways operating at 100% health.
                  </p>
                </div>
              ) : (
                (["Today", "Yesterday", "Earlier"] as const).map((groupName) => {
                  const groupItems = groupedNotifications[groupName];
                  if (groupItems.length === 0) return null;

                  return (
                    <div key={groupName} className="space-y-2">
                      <div className="sticky top-0 z-10 bg-[#0c1228]/95 backdrop-blur-md py-1 px-1.5 flex items-center justify-between text-[11px] font-semibold tracking-wider text-gray-400 uppercase border-b border-white/[0.04]">
                        <span>{groupName}</span>
                        <span className="text-[9px] bg-white/[0.06] text-gray-400 px-1.5 py-0.2 rounded-full font-mono">
                          {groupItems.length}
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {groupItems.map((item) => {
                          const isArchived = archivedNotificationIds.includes(item.id);
                          return (
                            <motion.div
                              key={item.id}
                              layout
                              onClick={() => handleClickItem(item)}
                              className={cn(
                                "group relative rounded-xl border p-3.5 transition-all cursor-pointer",
                                item.read
                                  ? "border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] opacity-80"
                                  : "border-blue-500/20 bg-gradient-to-r from-blue-950/20 to-white/[0.02] hover:border-blue-500/40",
                                isArchived && "opacity-50 grayscale"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 shrink-0">
                                  {getCategoryIcon(item.category)}
                                </div>

                                <div className="flex-1 min-w-0 pr-6">
                                  <div className="flex items-center gap-1.5">
                                    <h4
                                      className={cn(
                                        "text-xs font-semibold tracking-tight truncate",
                                        item.read ? "text-gray-300" : "text-white"
                                      )}
                                    >
                                      {item.title}
                                    </h4>
                                    {!item.read && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                    )}
                                  </div>

                                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                    {item.description}
                                  </p>

                                  <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 font-mono">
                                    <span>{item.time}</span>
                                    <span>•</span>
                                    <span className="uppercase text-blue-400/80">{item.category}</span>
                                  </div>
                                </div>

                                <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0 self-center" />
                              </div>

                              {/* Quick Action Overlay on hover */}
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!item.read && (
                                  <button
                                    onClick={(e) => handleMarkItemRead(item.id, e)}
                                    className="p-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white"
                                    title="Mark as read"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => handleArchive(item.id, e)}
                                  className="p-1 rounded bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white"
                                  title="Archive"
                                >
                                  <Archive className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => handleDelete(item.id, e)}
                                  className="p-1 rounded bg-black/40 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Sparkles className="h-3 w-3 text-blue-400" />
                Live Sentinel stream active
              </span>
              <button
                onClick={() => {
                  setNotifications(MOCK_NOTIFICATIONS);
                  toast.success("Stream refreshed from multi-rail telemetry");
                }}
                className="text-blue-400 hover:text-blue-300 font-medium text-[11px]"
              >
                Reset Stream
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
