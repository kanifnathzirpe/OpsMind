"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { Merchant } from "@/lib/dashboard-data";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  selectedMerchant: Merchant;
  onSelectMerchant: (merchant: Merchant) => void;
  onOpenCommandPalette: () => void;
  onOpenCopilot: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  onToggleLoading?: () => void;
  isRealtimeActive?: boolean;
  onToggleRealtime?: () => void;
  onOpenInviteMembers?: () => void;
  onOpenSettingsTab?: (tab: string) => void;
}

export function DashboardLayout({
  children,
  className,
  activeTab = "overview",
  onTabChange,
  selectedMerchant,
  onSelectMerchant,
  onOpenCommandPalette,
  onOpenCopilot,
  onRefresh,
  isLoading = false,
  onToggleLoading,
  isRealtimeActive = true,
  onToggleRealtime,
  onOpenInviteMembers,
  onOpenSettingsTab,
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050816] text-white">
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onCollapsedChange={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onMobileOpenChange={setIsMobileSidebarOpen}
      />
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <TopNavbar
          selectedMerchant={selectedMerchant}
          onSelectMerchant={onSelectMerchant}
          onOpenCommandPalette={onOpenCommandPalette}
          onOpenCopilot={onOpenCopilot}
          onOpenInviteMembers={onOpenInviteMembers}
          onOpenSettingsTab={onOpenSettingsTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onRefresh={onRefresh}
          isLoading={isLoading}
          onToggleLoading={onToggleLoading}
          isRealtimeActive={isRealtimeActive}
          onToggleRealtime={onToggleRealtime}
          onSelectTab={onTabChange}
        />
        <main
          className={cn(
            "flex-1 overflow-y-auto bg-[#050816] p-4 md:p-6 lg:p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}