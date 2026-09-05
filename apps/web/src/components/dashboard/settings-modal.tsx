"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Palette,
  Bell,
  Building2,
  CreditCard,
  AlertTriangle,
  X,
  Sliders,
  User,
  Globe,
  Users,
  ShieldAlert,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Merchant } from "@/lib/dashboard-data";
import { ProfileTab } from "@/components/settings/profile-tab";
import { OrganizationTab } from "@/components/settings/organization-tab";
import { SecurityTab } from "@/components/settings/security-tab";
import { NotificationsTab } from "@/components/settings/notifications-tab";
import { ApiKeysTab } from "@/components/settings/api-keys-tab";
import { BillingTab } from "@/components/settings/billing-tab";
import { WebhooksTab } from "@/components/settings/webhooks-tab";
import { TeamTab } from "@/components/settings/team-tab";
import { toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMerchant: Merchant;
  defaultTab?: string;
}

type SettingsSection =
  | "general"
  | "profile"
  | "organization"
  | "security"
  | "notifications"
  | "apikeys"
  | "billing"
  | "webhooks"
  | "team"
  | "theme"
  | "danger";

export function SettingsModal({
  isOpen,
  onClose,
  selectedMerchant,
  defaultTab = "general",
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = React.useState<SettingsSection>(defaultTab as SettingsSection);

  // General state
  const [workspaceName, setWorkspaceName] = React.useState("Production Merchant Ops");
  const [supportEmail, setSupportEmail] = React.useState("support@opsmind.io");
  const [autoDunning, setAutoDunning] = React.useState(true);
  const [realtimeTelemetry, setRealtimeTelemetry] = React.useState(true);

  // Theme state
  const [themeMode, setThemeMode] = React.useState<"dark" | "midnight" | "obsidian">("dark");
  const [blurIntensity, setBlurIntensity] = React.useState(85);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("General settings saved", {
      description: "Workspace parameters and autonomous dunning policies updated.",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Workspace & System Settings"
            className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0c102b] shadow-2xl shadow-black/90 flex flex-col h-[640px] max-h-[92vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black/30">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Workspace & System Settings
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    OpsMind OS configuration • {selectedMerchant.name} ({selectedMerchant.currency})
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

            {/* Body: Sidebar Tabs + Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Subnav */}
              <div className="w-48 sm:w-56 border-r border-white/[0.08] bg-black/20 p-3 space-y-1 overflow-y-auto">
                {[
                  { id: "general", label: "General", icon: Sliders },
                  { id: "profile", label: "Profile", icon: User },
                  { id: "organization", label: "Organization", icon: Building2 },
                  { id: "security", label: "Security", icon: ShieldAlert },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "apikeys", label: "API Keys", icon: KeyRound },
                  { id: "billing", label: "Billing", icon: CreditCard },
                  { id: "webhooks", label: "Webhooks", icon: Globe },
                  { id: "team", label: "Team", icon: Users },
                  { id: "theme", label: "Theme", icon: Palette },
                  { id: "danger", label: "Danger Zone", icon: AlertTriangle, variant: "destructive" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as SettingsSection)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
                        isActive
                          ? item.variant === "destructive"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "bg-blue-600/20 text-white border border-blue-500/30"
                          : item.variant === "destructive"
                          ? "text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-300"
                          : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Content Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* 1. GENERAL SECTION */}
                {activeSection === "general" && (
                  <form onSubmit={handleSaveGeneral} className="space-y-5">
                    <div>
                      <h4 className="text-sm font-semibold text-white">General Preferences</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Manage baseline workspace routing, alerts, and retry automation.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Workspace Name</label>
                      <input
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="w-full h-9 rounded-md bg-black/30 border border-white/10 px-3 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Operations Escalation Email</label>
                      <input
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full h-9 rounded-md bg-black/30 border border-white/10 px-3 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div>
                          <span className="text-xs font-medium text-white block">Autonomous Smart-Dunning</span>
                          <span className="text-[11px] text-gray-400">Execute multi-rail retries automatically during cardholder payroll windows.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoDunning}
                          onChange={(e) => {
                            setAutoDunning(e.target.checked);
                            toast.success(`Autonomous dunning ${e.target.checked ? "activated" : "disabled"}`);
                          }}
                          className="h-4 w-4 accent-blue-600 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div>
                          <span className="text-xs font-medium text-white block">Realtime Telemetry Streaming</span>
                          <span className="text-[11px] text-gray-400">Stream incoming order authorizations, fraud alerts, and settlements.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={realtimeTelemetry}
                          onChange={(e) => {
                            setRealtimeTelemetry(e.target.checked);
                            toast.success(`Telemetry streaming ${e.target.checked ? "enabled" : "paused"}`);
                          }}
                          className="h-4 w-4 accent-blue-600 rounded"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-xs text-white">
                      Save Changes
                    </Button>
                  </form>
                )}

                {/* 2. PROFILE SECTION */}
                {activeSection === "profile" && <ProfileTab />}

                {/* 3. ORGANIZATION SECTION */}
                {activeSection === "organization" && <OrganizationTab />}

                {/* 4. SECURITY SECTION */}
                {activeSection === "security" && <SecurityTab />}

                {/* 5. NOTIFICATIONS SECTION */}
                {activeSection === "notifications" && <NotificationsTab />}

                {/* 6. API KEYS SECTION */}
                {activeSection === "apikeys" && <ApiKeysTab />}

                {/* 7. BILLING SECTION */}
                {activeSection === "billing" && <BillingTab />}

                {/* 8. WEBHOOKS SECTION */}
                {activeSection === "webhooks" && <WebhooksTab />}

                {/* 9. TEAM SECTION */}
                {activeSection === "team" && <TeamTab />}

                {/* 10. THEME SECTION */}
                {activeSection === "theme" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Theme & Display</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Customize visual appearance and interface preferences.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-300 block mb-2">Color Mode</label>
                        <div className="grid grid-cols-3 gap-3">
                          {["dark", "midnight", "obsidian"].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => {
                                setThemeMode(mode as "dark" | "midnight" | "obsidian");
                                toast.success(`Theme changed to ${mode}`);
                              }}
                              className={cn(
                                "p-3 rounded-lg border text-xs font-medium transition-all",
                                themeMode === mode
                                  ? "bg-blue-600/20 border-blue-500/30 text-white"
                                  : "bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04]"
                              )}
                            >
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-300 block mb-2">Glass Blur Intensity: {blurIntensity}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={blurIntensity}
                          onChange={(e) => setBlurIntensity(Number(e.target.value))}
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. DANGER ZONE SECTION */}
                {activeSection === "danger" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white text-rose-400">Danger Zone</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Irreversible and destructive operations. Proceed with extreme caution.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                      <span>Actions in this area directly impact live API authorization gateways.</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div>
                          <span className="text-xs font-semibold text-white block">Purge Audit Cache</span>
                          <span className="text-[11px] text-gray-400">Clear ephemeral Redis event logs across all edge regions.</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast.info("Purging ephemeral Redis audit caches...");
                          }}
                          className="border-white/20 text-gray-300 hover:text-white text-xs"
                        >
                          Purge Cache
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.03]">
                        <div>
                          <span className="text-xs font-semibold text-rose-300 block">Emergency Gateway Quarantine</span>
                          <span className="text-[11px] text-gray-400">Places store {selectedMerchant.name} into strict hold to isolate zero-day threat.</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast.error("Merchant Gateway Quarantined");
                          }}
                          className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs"
                        >
                          Quarantine
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}