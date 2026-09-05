"use client";

import * as React from "react";
import {
  useNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/hooks/queries/use-dashboard-queries";
import { Bell, ShieldAlert, CreditCard, Mail, MessageSquare, Phone, Globe, Loader2 } from "lucide-react";
import { NotificationPreferences } from "@/types/auth";

export function NotificationsTab() {
  const { data: prefs, isLoading } = useNotificationPreferencesQuery();
  const updateMutation = useUpdateNotificationPreferencesMutation();

  if (isLoading || !prefs) {
    return (
      <div className="py-12 flex justify-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
      </div>
    );
  }

  const handleToggle = (key: keyof NotificationPreferences) => {
    updateMutation.mutate({ [key]: !prefs[key] });
  };

  const notificationChannels = [
    {
      key: "fraudAlerts" as const,
      title: "Realtime Fraud & Velocity Surges",
      desc: "Instant notifications when Sentinel identifies carding attacks or risk scores > 85.",
      icon: ShieldAlert,
      color: "text-rose-400",
    },
    {
      key: "paymentRecovery" as const,
      title: "Autonomous Payment Recovery",
      desc: "Alerts when AI dunning successfully recovers declined customer checkouts.",
      icon: CreditCard,
      color: "text-emerald-400",
    },
    {
      key: "emailDigest" as const,
      title: "Daily Executive Financial Briefing",
      desc: "Comprehensive morning summary of revenue, net margin, and risk mitigation.",
      icon: Mail,
      color: "text-blue-400",
    },
    {
      key: "slackAlerts" as const,
      title: "Slack Incident Webhook",
      desc: "Post priority P0 & P1 operational alerts directly to #ops-war-room.",
      icon: MessageSquare,
      color: "text-purple-400",
    },
    {
      key: "smsEscalations" as const,
      title: "SMS On-Call Escalations",
      desc: "Text message alerts to on-call payment engineers if gateway latency spikes > 2000ms.",
      icon: Phone,
      color: "text-amber-400",
    },
    {
      key: "webhookTriggers" as const,
      title: "Outbound Webhook Dispatches",
      desc: "Emit JSON payloads to external endpoints on chargeback and dispute events.",
      icon: Globe,
      color: "text-cyan-400",
    },
    {
      key: "browserPush" as const,
      title: "Browser Push Notifications",
      desc: "Native desktop notifications for high-priority transaction anomalies.",
      icon: Bell,
      color: "text-indigo-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-400" />
          Notification Preferences & Escalations
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure real-time delivery channels for fraud, payment recoveries, and daily summaries.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#0d1226]/60 divide-y divide-white/[0.04]">
        {notificationChannels.map((item) => {
          const Icon = item.icon;
          const isEnabled = prefs[item.key];

          return (
            <div
              key={item.key}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/5 shrink-0 mt-0.5">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">{item.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isEnabled ? "bg-blue-600" : "bg-white/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
