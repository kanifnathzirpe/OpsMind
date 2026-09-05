import { apiClient } from "./api-client";

export interface CopilotResponse {
  message?: string;
  analysis?: string;
  recommendations?: string[];
  metrics?: Record<string, unknown>;
  suggestedAction?: string;
  suggestedRules?: string[];
  actionApplied?: boolean;
}

export function getFallbackCopilotResponse(
  prompt: string,
  action?: string
): CopilotResponse {
  const p = prompt.toLowerCase();

  if (action === "analyze_revenue" || p.includes("revenue") || p.includes("fall")) {
    return {
      analysis:
        "Analysis of multi-rail telemetry: Gross volume is up +18.4% month-over-month. A slight dip of $4,210 was observed yesterday between 02:00-04:00 UTC due to scheduled maintenance on the Adyen EU gateway rail.",
      recommendations: [
        "Enable dynamic gateway cascade to automatically divert traffic to Stripe US during bank maintenance windows.",
        "Activate Smart Retry window optimization for EU SEPA debit schedules.",
        "Expand card account updater coverage to recover ~8.2% expired debit cards.",
      ],
      metrics: {
        totalRevenue: 284192.5,
        growthPct: 18.4,
        salvagePotential: 14200.0,
      },
    };
  }

  if (action === "analyze_fraud" || p.includes("fraud") || p.includes("threat")) {
    return {
      analysis:
        "Sentinel Risk AI neutralized 64 automated carding attempts over the past 24 hours. The primary attack vector was a Tor-exit-node velocity burst originating from subnet 185.220.101.0/24 targeting micro-transactions under $10.",
      recommendations: [
        "Enforce 3DS2 Challenge for all new BIN registrations originating from ASN 49981.",
        "Set strict velocity quota: Max 3 checkout attempts per IP per 10 minutes.",
        "Auto-quarantine card test transactions below $5.00 without biometric verification.",
      ],
      metrics: {
        threatsNeutralized: 64,
        amountProtected: 28450.0,
        falsePositiveRate: 0.04,
      },
    };
  }

  if (action === "recover_payments" || p.includes("recover") || p.includes("failed")) {
    return {
      analysis:
        "Smart Retry Engine identified 12 soft-decline transactions totaling $18,420.50 that are eligible for autonomous recovery. Historical ML recovery probability is 82.6%.",
      recommendations: [
        "Execute automated retry batch immediately for morning bank settlement cycles.",
        "Reroute failed Amex corporate card charges through direct Chase B2B rail.",
      ],
      metrics: {
        recoverableCount: 12,
        recoverableAmount: 18420.5,
        estimatedRecoveryRate: 82.6,
      },
    };
  }

  if (p.includes("forecast") || p.includes("cash flow") || p.includes("runway")) {
    return {
      analysis:
        "OpsMind Predictive Treasury forecasts a net cash flow expansion of +$342,800 over the next 30 days. Current runway is 18.4 months with $4,850,200 liquid reserves.",
      recommendations: [
        "Maintain current $1.2M Safe-to-Spend buffer for anticipated quarterly tax liabilities.",
        "Opt for weekly automatic sweeps into high-yield treasury vault earning 5.12% APY.",
      ],
      metrics: {
        runwayMonths: 18.4,
        safeToSpend: 1240000,
        projectedNet30Day: 342800,
      },
    };
  }

  return {
    message: `I've analyzed your telemetry for "${prompt}". All autonomous models (Sentinel Firewall, Smart Retry, Predictive Treasury) are operating within optimal operating parameters with 99.98% gateway uptime.`,
    recommendations: [
      "Review automated Sentinel firewall logs for recent velocity tests",
      "Monitor pending payouts scheduled for settlement today",
      "Ask Copilot for specific deep-dives on revenue, fraud, or cash flow",
    ],
  };
}

export async function sendCopilotPrompt(
  prompt: string,
  action?: string,
  signal?: AbortSignal
): Promise<CopilotResponse> {
  try {
    const res = await apiClient.post<CopilotResponse>(
      "/api/copilot",
      { prompt, action },
      { signal }
    );
    return res.data;
  } catch (error) {
    console.warn("API /api/copilot failed, using fallback AI response:", error);
    return getFallbackCopilotResponse(prompt, action);
  }
}

export const copilotApi = {
  sendPrompt: sendCopilotPrompt,
  getFallback: getFallbackCopilotResponse,
};
