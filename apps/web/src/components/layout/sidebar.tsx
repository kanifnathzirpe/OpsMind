"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  ShieldAlert,
  CreditCard,
  LineChart,
  Bot,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NavigationItem {
  name: string;
  id: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "warning" | "success" | "destructive";
  permission?: string;
}

export const DASHBOARD_NAV_ITEMS: NavigationItem[] = [
  { name: "Dashboard", id: "overview", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
  { name: "Revenue", id: "revenue", href: "/dashboard?tab=revenue", icon: TrendingUp, permission: "revenue:view" },
  { name: "Fraud", id: "fraud", href: "/dashboard?tab=fraud", icon: ShieldAlert, badge: "3", badgeVariant: "destructive", permission: "fraud:view" },
  { name: "Payments", id: "payments", href: "/dashboard?tab=payments", icon: CreditCard, permission: "payments:view" },
  { name: "Forecast", id: "forecast", href: "/dashboard?tab=forecast", icon: LineChart, permission: "forecast:view" },
  { name: "AI Copilot", id: "copilot", href: "/dashboard?tab=copilot", icon: Bot, badge: "AI", badgeVariant: "success", permission: "copilot:use" },
  { name: "Customers", id: "customers", href: "/dashboard?tab=customers", icon: Users, permission: "customers:view" },
  { name: "Settings", id: "settings", href: "/dashboard?tab=settings", icon: Settings, permission: "settings:manage" },
];

interface SidebarProps {
  className?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function Sidebar({
  className,
  activeTab = "overview",
  onTabChange,
  onCollapsedChange,
  isMobileOpen: externalIsMobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || activeTab || "overview";

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [internalIsMobileOpen, setInternalIsMobileOpen] = React.useState(false);
  const { permissions } = useAuth();

  const visibleNavItems = React.useMemo(() => {
    return DASHBOARD_NAV_ITEMS.filter((item) => {
      if (!item.permission) return true;
      return permissions.length === 0 || permissions.includes(item.permission);
    });
  }, [permissions]);

  const isMobileOpen = externalIsMobileOpen !== undefined ? externalIsMobileOpen : internalIsMobileOpen;
  const setIsMobileOpen = (open: boolean) => {
    if (onMobileOpenChange) onMobileOpenChange(open);
    else setInternalIsMobileOpen(open);
  };

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-[#050816]/90 border-white/10 text-white hover:bg-white/10"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out select-none",
          "border-r border-white/[0.08] bg-[#070b19]/95 backdrop-blur-xl flex flex-col justify-between",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Brand Header */}
          <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group focus:outline-none"
              onClick={() => onTabChange?.("overview")}
            >
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                <div className="h-full w-full bg-[#050816] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                </div>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base tracking-tight text-white">
                      OpsMind
                    </span>
                    <span className="rounded bg-blue-500/10 border border-blue-500/30 px-1 py-0.2 text-[10px] font-semibold text-blue-400">
                      PRO
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 -mt-0.5">
                    Autonomous Ops
                  </span>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCollapseToggle}
                className="hidden lg:flex h-7 w-7 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden h-7 w-7 text-gray-400 hover:text-white rounded-lg"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick AI Status Pill */}
          {!isCollapsed && (
            <div className="px-3 pt-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/[0.07] border border-blue-500/20 text-xs text-blue-300">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium text-[11px]">Sentinel AI Active</span>
                </div>
                <Zap className="h-3 w-3 text-emerald-400" />
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto mt-1">
            <div className="px-2 pb-1.5">
              {!isCollapsed && (
                <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400">
                  Operations
                </span>
              )}
            </div>

            {visibleNavItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    onTabChange?.(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-blue-600/15 text-white border border-blue-500/30 shadow-sm shadow-blue-900/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  {/* Left glowing active marker */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r shadow-[0_0_8px_#3b82f6]" />
                  )}

                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-blue-400"
                        : "text-gray-400 group-hover:text-gray-200"
                    )}
                  />

                  {!isCollapsed && (
                    <div className="flex flex-1 items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] font-semibold rounded-full border",
                            item.badgeVariant === "destructive"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : item.badgeVariant === "success"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer controls & Collapse Button */}
          <div className="border-t border-white/[0.08] p-3 space-y-2">
            {isCollapsed ? (
              <Button
                variant="ghost"
                size="icon"
                className="w-full h-9 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-center"
                onClick={handleCollapseToggle}
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="rounded-lg p-2.5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Merchant Health</span>
                  <span className="text-emerald-400 font-semibold">99.8%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-[99.8%]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}