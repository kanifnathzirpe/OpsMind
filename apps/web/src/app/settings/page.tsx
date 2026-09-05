"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MOCK_MERCHANTS, Merchant } from "@/lib/dashboard-data";
import { SettingsModal } from "@/components/dashboard/settings-modal";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";

  const [selectedMerchant, setSelectedMerchant] = React.useState<Merchant>(MOCK_MERCHANTS[0]);

  const handleTabChange = (tab: string) => {
    router.push(`/settings?tab=${tab}`);
  };

  const handleMerchantChange = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
  };

  return (
    <DashboardLayout
      activeTab="settings"
      onTabChange={handleTabChange}
      selectedMerchant={selectedMerchant}
      onSelectMerchant={handleMerchantChange}
      onOpenCommandPalette={() => {}}
      onOpenCopilot={() => {}}
      onRefresh={() => {}}
      isLoading={false}
      onToggleLoading={() => {}}
      isRealtimeActive={true}
      onToggleRealtime={() => {}}
    >
      <SettingsModal
        isOpen={true}
        onClose={() => router.push("/dashboard")}
        selectedMerchant={selectedMerchant}
        defaultTab={activeTab}
      />
    </DashboardLayout>
  );
}