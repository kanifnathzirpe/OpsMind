"use client";

import * as React from "react";
import {
  OrderItem,
  ActivityTimelineItem,
  KPIData,
  Merchant,
  MOCK_ORDERS,
  MOCK_ACTIVITIES,
  MOCK_KPIS,
  MOCK_MERCHANTS,
} from "@/lib/dashboard-data";
import { toast } from "sonner";

export type EventType =
  | "payment_recovered"
  | "fraud_blocked"
  | "revenue_updated"
  | "settlement_completed"
  | "refund_processed";

import { useStore } from "@/store/use-store";

export interface RealtimeEngineInitialData {
  kpis?: KPIData[];
  orders?: OrderItem[];
  activities?: ActivityTimelineItem[];
  merchant?: Merchant;
}

export function useRealtimeEngine(initialData?: RealtimeEngineInitialData) {
  const storedWorkspaceId = useStore((s) => s.workspaceId);
  const selectedMerchant = React.useMemo(() => {
    return (
      initialData?.merchant ||
      MOCK_MERCHANTS.find((m) => m.id === storedWorkspaceId) ||
      MOCK_MERCHANTS[0]
    );
  }, [initialData?.merchant, storedWorkspaceId]);

  const setSelectedMerchant = React.useCallback((merchant: Merchant) => {
    useStore.getState().setWorkspaceId(merchant.id);
  }, []);

  const [isRealtimeActive, setIsRealtimeActive] = React.useState(true);

  const [orders, setOrders] = React.useState<OrderItem[]>(
    initialData?.orders && initialData.orders.length > 0 ? initialData.orders : MOCK_ORDERS
  );
  const [activities, setActivities] = React.useState<ActivityTimelineItem[]>(
    initialData?.activities && initialData.activities.length > 0
      ? initialData.activities
      : MOCK_ACTIVITIES
  );
  const [kpis, setKpis] = React.useState<KPIData[]>(
    initialData?.kpis && initialData.kpis.length > 0 ? initialData.kpis : MOCK_KPIS
  );
  const [simIndex, setSimIndex] = React.useState(0);
  const [lastUpdatedKpiId, setLastUpdatedKpiId] = React.useState<string | undefined>();
  const [lastUpdatedType, setLastUpdatedType] = React.useState<"green" | "red" | undefined>();

  // Sync when API query yields fresh initial data
  const hasSyncedKpis = React.useRef(false);
  React.useEffect(() => {
    if (initialData?.kpis && initialData.kpis.length > 0 && !hasSyncedKpis.current) {
      setKpis(initialData.kpis);
      hasSyncedKpis.current = true;
    }
  }, [initialData?.kpis]);

  const hasSyncedOrders = React.useRef(false);
  React.useEffect(() => {
    if (initialData?.orders && initialData.orders.length > 0 && !hasSyncedOrders.current) {
      setOrders(initialData.orders);
      hasSyncedOrders.current = true;
    }
  }, [initialData?.orders]);

  const hasSyncedActivities = React.useRef(false);
  React.useEffect(() => {
    if (initialData?.activities && initialData.activities.length > 0 && !hasSyncedActivities.current) {
      setActivities(initialData.activities);
      hasSyncedActivities.current = true;
    }
  }, [initialData?.activities]);

  // Clear flash state after 1.8 seconds
  React.useEffect(() => {
    if (lastUpdatedKpiId) {
      const timer = setTimeout(() => {
        setLastUpdatedKpiId(undefined);
        setLastUpdatedType(undefined);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedKpiId]);

  // 4-second interval multi-event simulator
  React.useEffect(() => {
    if (!isRealtimeActive) return;

    const interval = setInterval(() => {
      const eventTypes: EventType[] = [
        "payment_recovered",
        "fraud_blocked",
        "revenue_updated",
        "settlement_completed",
        "refund_processed",
      ];
      const currentEvent = eventTypes[simIndex % eventTypes.length];
      const nowTime =
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }) + " UTC";

      if (currentEvent === "payment_recovered") {
        const amount = +(Math.random() * 200 + 180).toFixed(2);
        const cardLast4 = Math.floor(Math.random() * 8999 + 1000).toString();

        setKpis((prev) =>
          prev.map((kpi) => {
            if (kpi.id === "recovered_revenue" || kpi.id === "today_revenue") {
              const updated = +(kpi.numericValue + amount).toFixed(2);
              return {
                ...kpi,
                numericValue: updated,
                value: `${selectedMerchant.currencySymbol}${updated.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                sparkline: [...kpi.sparkline.slice(1), kpi.sparkline[kpi.sparkline.length - 1] + 15],
              };
            }
            return kpi;
          })
        );
        setLastUpdatedKpiId("recovered_revenue");
        setLastUpdatedType("green");

        const newActivity: ActivityTimelineItem = {
          id: `act_${Date.now()}`,
          title: `Smart Retry Recovered: ${selectedMerchant.currencySymbol}${amount}`,
          description: `Salvaged soft-decline invoice via card ending in ${cardLast4}.`,
          actor: "Recovery Agent",
          actorType: "ai",
          timestamp: "Just now",
          type: "recovery",
          metadata: `pi_rec_${Date.now().toString().slice(-6)}`,
        };
        setActivities((prev) => [newActivity, ...prev.slice(0, 12)]);

        toast.success(
          `Payment Recovered: +${selectedMerchant.currencySymbol}${amount}`,
          {
            description: `Smart Retry salvaged soft decline for card •••• ${cardLast4}`,
          }
        );
      } else if (currentEvent === "fraud_blocked") {
        const amount = +(Math.random() * 1200 + 650).toFixed(2);
        const ip = `185.220.101.${Math.floor(Math.random() * 150 + 10)}`;

        setKpis((prev) =>
          prev.map((kpi) => {
            if (kpi.id === "fraud_blocked") {
              const updated = +(kpi.numericValue + amount).toFixed(2);
              return {
                ...kpi,
                numericValue: updated,
                value: `${selectedMerchant.currencySymbol}${updated.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                sparkline: [...kpi.sparkline.slice(1), kpi.sparkline[kpi.sparkline.length - 1] + 20],
              };
            }
            return kpi;
          })
        );
        setLastUpdatedKpiId("fraud_blocked");
        setLastUpdatedType("green");

        const newActivity: ActivityTimelineItem = {
          id: `act_${Date.now()}`,
          title: `Sentinel Blocked Attack: ${selectedMerchant.currencySymbol}${amount}`,
          description: `High-velocity carding threat neutralized from ${ip}.`,
          actor: "Sentinel Firewall",
          actorType: "system",
          timestamp: "Just now",
          type: "fraud",
          metadata: ip,
        };
        setActivities((prev) => [newActivity, ...prev.slice(0, 12)]);

        toast.warning(
          `Fraud Threat Neutralized: ${selectedMerchant.currencySymbol}${amount}`,
          {
            description: `Velocity attack probe from ${ip} quarantined before capture`,
          }
        );
      } else if (currentEvent === "revenue_updated") {
        const amount = +(Math.random() * 350 + 120).toFixed(2);
        const orderNum = `OPS-${90200 + simIndex}`;

        const newOrder: OrderItem = {
          id: `ord_${Date.now()}`,
          orderNumber: orderNum,
          paymentIntentId: `pi_3NpK_${Date.now().toString().slice(-8)}`,
          chargeId: `ch_3NpK_${Date.now().toString().slice(-8)}`,
          customerId: `cus_${Date.now().toString().slice(-6)}`,
          customerName: "Lucas Vance",
          customerEmail: "lucas.v@vancecorp.io",
          customerAvatar: "LV",
          amount: amount,
          fee: +(amount * 0.029 + 0.3).toFixed(2),
          net: +(amount - (amount * 0.029 + 0.3)).toFixed(2),
          currency: selectedMerchant.currency,
          status: "succeeded",
          paymentMethod: {
            brand: "visa",
            last4: "9102",
            expMonth: 8,
            expYear: 2028,
            funding: "credit",
            issuer: "JPMorgan Chase Bank",
          },
          fraudRiskScore: 6,
          riskLevel: "low",
          riskExplanation: "Clean biometric auth and zero latency anomaly.",
          riskFactors: ["Frictionless 3DS2 Approved", "Known Merchant Gateway"],
          date: "Today",
          time: nowTime,
          itemsCount: 1,
          country: "US",
          ipAddress: `198.51.100.${Math.floor(Math.random() * 200 + 10)}`,
          timeline: [
            { step: "Order Initiated", timestamp: nowTime, status: "completed", detail: "Checkout completed via Hosted UI" },
            { step: "3D Secure Verified", timestamp: nowTime, status: "completed", detail: "Biometric approval" },
            { step: "Funds Captured", timestamp: nowTime, status: "completed", detail: "Auto-captured to merchant ledger" },
          ],
          stripeEvents: [
            { id: `evt_${Date.now()}`, type: "payment_intent.succeeded", timestamp: nowTime, livemode: true },
          ],
          webhookLogs: [
            { id: `wh_${Date.now()}`, url: "https://api.opsmind.io/webhooks/stripe", status: 200, duration: "29ms", timestamp: nowTime },
          ],
        };

        setOrders((prev) => [newOrder, ...prev.slice(0, 15)]);

        setKpis((prev) =>
          prev.map((kpi) => {
            if (kpi.id === "today_revenue" || kpi.id === "cash_position") {
              const updated = +(kpi.numericValue + amount).toFixed(2);
              return {
                ...kpi,
                numericValue: updated,
                value: `${selectedMerchant.currencySymbol}${updated.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                sparkline: [...kpi.sparkline.slice(1), kpi.sparkline[kpi.sparkline.length - 1] + 10],
              };
            }
            return kpi;
          })
        );
        setLastUpdatedKpiId("today_revenue");
        setLastUpdatedType("green");

        const newActivity: ActivityTimelineItem = {
          id: `act_${Date.now()}`,
          title: `Revenue Updated: +${selectedMerchant.currencySymbol}${amount}`,
          description: `Order ${orderNum} captured via Stripe US.`,
          actor: "AutoPilot Engine",
          actorType: "ai",
          timestamp: "Just now",
          type: "payment",
          metadata: orderNum,
        };
        setActivities((prev) => [newActivity, ...prev.slice(0, 12)]);

        toast.info(
          `Revenue Stream: +${selectedMerchant.currencySymbol}${amount}`,
          {
            description: `Order ${orderNum} settled via Stripe US`,
          }
        );
      } else if (currentEvent === "settlement_completed") {
        const batchAmount = +(Math.random() * 8000 + 4000).toFixed(2);

        setKpis((prev) =>
          prev.map((kpi) => {
            if (kpi.id === "cash_position") {
              const updated = +(kpi.numericValue + batchAmount).toFixed(2);
              return {
                ...kpi,
                numericValue: updated,
                value: `${selectedMerchant.currencySymbol}${(updated / 1000000).toFixed(2)}M`,
                sparkline: [...kpi.sparkline.slice(1), kpi.sparkline[kpi.sparkline.length - 1] + 25],
              };
            }
            return kpi;
          })
        );
        setLastUpdatedKpiId("cash_position");
        setLastUpdatedType("green");

        const newActivity: ActivityTimelineItem = {
          id: `act_${Date.now()}`,
          title: `Settlement Cleared: ${selectedMerchant.currencySymbol}${batchAmount.toLocaleString()}`,
          description: `Automated clearing house batch deposited into Operating Reserve.`,
          actor: "Treasury Rail",
          actorType: "system",
          timestamp: "Just now",
          type: "forecast",
          metadata: "ACH-BATCH-901",
        };
        setActivities((prev) => [newActivity, ...prev.slice(0, 12)]);

        toast.success("Settlement Completed", {
          description: `${selectedMerchant.currencySymbol}${batchAmount.toLocaleString()} deposited into Treasury Operating Ledger`,
        });
      } else if (currentEvent === "refund_processed") {
        const refundAmt = +(Math.random() * 60 + 25).toFixed(2);

        setKpis((prev) =>
          prev.map((kpi) => {
            if (kpi.id === "today_revenue") {
              const updated = +(kpi.numericValue - refundAmt).toFixed(2);
              return {
                ...kpi,
                numericValue: updated,
                value: `${selectedMerchant.currencySymbol}${updated.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                sparkline: [...kpi.sparkline.slice(1), kpi.sparkline[kpi.sparkline.length - 1] - 8],
              };
            }
            return kpi;
          })
        );
        setLastUpdatedKpiId("today_revenue");
        setLastUpdatedType("red");

        const newActivity: ActivityTimelineItem = {
          id: `act_${Date.now()}`,
          title: `Refund Processed: -${selectedMerchant.currencySymbol}${refundAmt}`,
          description: `Dispute pre-empted to safeguard 0.1% gateway chargeback threshold.`,
          actor: "Dispute Bot",
          actorType: "ai",
          timestamp: "Just now",
          type: "payment",
          metadata: "DISP-AUTOPROTECT",
        };
        setActivities((prev) => [newActivity, ...prev.slice(0, 12)]);

        toast.error(`Refund Processed: -${selectedMerchant.currencySymbol}${refundAmt}`, {
          description: `Automated dispute reversal executed to maintain 0.0% chargeback ratio`,
        });
      }

      setSimIndex((prev) => prev + 1);
    }, 4000); // 4-second simulated pulse

    return () => clearInterval(interval);
  }, [isRealtimeActive, simIndex, selectedMerchant]);

  const handleRefundOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "refunded" } : o))
    );
  };

  const handleRecoveredAmount = (amount: number) => {
    setKpis((prev) =>
      prev.map((kpi) => {
        if (kpi.id === "recovered_revenue") {
          const updated = +(kpi.numericValue + amount).toFixed(2);
          return {
            ...kpi,
            numericValue: updated,
            value: `${selectedMerchant.currencySymbol}${updated.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          };
        }
        return kpi;
      })
    );
    setLastUpdatedKpiId("recovered_revenue");
    setLastUpdatedType("green");
  };

  return {
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
  };
}
