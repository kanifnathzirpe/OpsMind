export interface KPIData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  comparison: string;
  sparkline: number[];
  accentColor: string;
}

export interface RevenueDataPoint {
  date: string;
  fullDate: string;
  grossRevenue: number;
  netRevenue: number;
  recoveredRevenue: number;
  fees: number;
  ordersCount: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  paymentIntentId: string;
  chargeId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  amount: number;
  fee: number;
  net: number;
  currency: string;
  status: "succeeded" | "pending" | "processing" | "failed" | "refunded";
  paymentMethod: {
    brand: "visa" | "mastercard" | "amex" | "apple-pay";
    last4: string;
    expMonth: number;
    expYear: number;
    funding: "credit" | "debit";
    issuer: string;
  };
  fraudRiskScore: number; // 0 to 100
  riskLevel: "low" | "medium" | "high";
  riskExplanation: string;
  riskFactors: string[];
  date: string;
  time: string;
  itemsCount: number;
  country: string;
  ipAddress: string;
  timeline: {
    step: string;
    timestamp: string;
    status: "completed" | "failed" | "pending";
    detail: string;
  }[];
  stripeEvents: {
    id: string;
    type: string;
    timestamp: string;
    livemode: boolean;
  }[];
  webhookLogs: {
    id: string;
    url: string;
    status: number;
    duration: string;
    timestamp: string;
  }[];
  recoveryAttempts?: {
    attempt: number;
    date: string;
    method: string;
    result: "success" | "soft_fail" | "declined";
  }[];
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  impact: string;
  metric: string;
  category: "routing" | "recovery" | "fraud" | "treasury";
  confidence: number;
  suggestedAction: string;
  isApplied?: boolean;
  timestamp: string;
}

export interface CashFlowData {
  currentLiquidity: number;
  runwayMonths: number;
  safeToSpend: number;
  projected30DayNet: number;
  upcomingEvents: {
    id: string;
    type: "inflow" | "outflow";
    title: string;
    amount: number;
    date: string;
    source: string;
  }[];
  forecastSeries: {
    day: string;
    projectedBalance: number;
    upperBound: number;
    lowerBound: number;
    inflow: number;
    outflow: number;
  }[];
}

export interface FraudAlertItem {
  id: string;
  score: number;
  level: "critical" | "high" | "medium";
  vector: string;
  customer: string;
  amount: number;
  location: string;
  ip: string;
  bin: string;
  timestamp: string;
  status: "blocked" | "flagged" | "quarantined";
}

export interface FailedPaymentItem {
  id: string;
  customer: string;
  email: string;
  amount: number;
  declineCode: string;
  declineReason: string;
  gateway: string;
  attempts: number;
  nextRetry: string;
  recoveryProbability: number; // 0-100%
  status: "scheduled" | "recovering" | "recovered" | "exhausted";
}

export interface ActivityTimelineItem {
  id: string;
  title: string;
  description: string;
  actor: string;
  actorType: "ai" | "system" | "user";
  timestamp: string;
  type: "fraud" | "payment" | "recovery" | "forecast" | "settings";
  metadata?: string;
}

export interface Merchant {
  id: string;
  name: string;
  code: string;
  region: string;
  currency: string;
  currencySymbol: string;
  status: "active" | "sandbox";
  multiplier: number;
  gateway?: string;
  theme?: "dark" | "light";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  category: "fraud" | "revenue" | "recovery" | "ai" | "system";
}

// -------------------------------------------------------------
// Mock Data Collections
// -------------------------------------------------------------

export const MOCK_MERCHANTS: Merchant[] = [
  { id: "m_1", name: "Acme Global Direct", code: "ACME-GL", region: "North America (USD)", currency: "USD", currencySymbol: "$", status: "active", multiplier: 1.0, gateway: "Stripe US", theme: "dark" },
  { id: "m_2", name: "Apex Labs Europe", code: "APEX-EU", region: "Europe (EUR)", currency: "EUR", currencySymbol: "€", status: "active", multiplier: 0.92, gateway: "Adyen EU", theme: "dark" },
  { id: "m_3", name: "HyperScale Retail UK", code: "HS-UK", region: "United Kingdom (GBP)", currency: "GBP", currencySymbol: "£", status: "active", multiplier: 0.78, gateway: "Checkout.com", theme: "dark" },
  { id: "m_4", name: "Starlight Sandbox", code: "STAR-SBX", region: "Global Test", currency: "USD", currencySymbol: "$", status: "sandbox", multiplier: 0.15, gateway: "Mock-Rail", theme: "dark" },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Velocity Spike Intercepted",
    description: "Blocked 14 rapid-fire card testing attempts from IP block 185.220.101.xx",
    time: "4m ago",
    read: false,
    category: "fraud",
  },
  {
    id: "notif_2",
    title: "Automatic Recovery Succeeded",
    description: "Recovered $1,840.00 failed invoice for CloudTech Partners on retry cycle 2",
    time: "28m ago",
    read: false,
    category: "recovery",
  },
  {
    id: "notif_3",
    title: "Stripe Settlement Dispatched",
    description: "Daily net payout of $89,420.10 transferred to Silicon Valley Bank Treasury account",
    time: "2h ago",
    read: false,
    category: "revenue",
  },
  {
    id: "notif_4",
    title: "AI Smart Routing Activated",
    description: "Routed 450 EU checkouts through Adyen to bypass 3DS latency anomalies",
    time: "4h ago",
    read: false,
    category: "ai",
  },
  {
    id: "notif_5",
    title: "Gateway TLS Certificate Verified",
    description: "Annual security rotation completed for Adyen Amsterdam endpoint",
    time: "6h ago",
    read: true,
    category: "system",
  },
];

export const MOCK_KPIS: KPIData[] = [
  {
    id: "today_revenue",
    title: "Today's Revenue",
    value: "$148,290.40",
    numericValue: 148290.4,
    change: "+14.2%",
    isPositive: true,
    comparison: "vs $129,810 yesterday",
    sparkline: [40, 48, 45, 60, 58, 72, 85, 94],
    accentColor: "#3b82f6",
  },
  {
    id: "recovered_revenue",
    title: "Recovered Revenue",
    value: "$34,820.00",
    numericValue: 34820.0,
    change: "+22.8%",
    isPositive: true,
    comparison: "94.2% AI recovery success rate",
    sparkline: [20, 25, 32, 28, 42, 50, 68, 80],
    accentColor: "#10b981",
  },
  {
    id: "fraud_blocked",
    title: "Fraud Blocked",
    value: "$86,410.00",
    numericValue: 86410.0,
    change: "-18.5%",
    isPositive: true,
    comparison: "34 high-risk txns intercepted",
    sparkline: [90, 75, 60, 55, 45, 38, 30, 24],
    accentColor: "#f59e0b",
  },
  {
    id: "pending_payments",
    title: "Pending Payments",
    value: "$12,940.50",
    numericValue: 12940.5,
    change: "-4.1%",
    isPositive: true,
    comparison: "8 settling, 2 manual audit",
    sparkline: [30, 28, 35, 32, 29, 25, 22, 19],
    accentColor: "#8b5cf6",
  },
  {
    id: "cash_position",
    title: "Cash Position",
    value: "$1,429,800.00",
    numericValue: 1429800.0,
    change: "+8.6%",
    isPositive: true,
    comparison: "18.4 months runway buffer",
    sparkline: [110, 115, 118, 124, 130, 135, 138, 142],
    accentColor: "#06b6d4",
  },
  {
    id: "growth_rate",
    title: "Growth % (MoM)",
    value: "+28.4%",
    numericValue: 28.4,
    change: "+4.2%",
    isPositive: true,
    comparison: "Exceeding Q3 target by 6.2%",
    sparkline: [15, 18, 20, 22, 24, 25, 27, 28.4],
    accentColor: "#ec4899",
  },
];

export const MOCK_REVENUE_SERIES: RevenueDataPoint[] = [
  { date: "Aug 06", fullDate: "Aug 6, 2026", grossRevenue: 98400, netRevenue: 89500, recoveredRevenue: 14200, fees: 2850, ordersCount: 1420 },
  { date: "Aug 09", fullDate: "Aug 9, 2026", grossRevenue: 104200, netRevenue: 95100, recoveredRevenue: 16800, fees: 3020, ordersCount: 1560 },
  { date: "Aug 12", fullDate: "Aug 12, 2026", grossRevenue: 112000, netRevenue: 102400, recoveredRevenue: 18900, fees: 3250, ordersCount: 1680 },
  { date: "Aug 15", fullDate: "Aug 15, 2026", grossRevenue: 108900, netRevenue: 99300, recoveredRevenue: 17400, fees: 3160, ordersCount: 1610 },
  { date: "Aug 18", fullDate: "Aug 18, 2026", grossRevenue: 125400, netRevenue: 115200, recoveredRevenue: 22100, fees: 3640, ordersCount: 1840 },
  { date: "Aug 21", fullDate: "Aug 21, 2026", grossRevenue: 131800, netRevenue: 121000, recoveredRevenue: 24800, fees: 3820, ordersCount: 1950 },
  { date: "Aug 24", fullDate: "Aug 24, 2026", grossRevenue: 128900, netRevenue: 118400, recoveredRevenue: 23600, fees: 3740, ordersCount: 1890 },
  { date: "Aug 27", fullDate: "Aug 27, 2026", grossRevenue: 142100, netRevenue: 130800, recoveredRevenue: 28900, fees: 4120, ordersCount: 2090 },
  { date: "Aug 30", fullDate: "Aug 30, 2026", grossRevenue: 139500, netRevenue: 128200, recoveredRevenue: 27400, fees: 4050, ordersCount: 2040 },
  { date: "Sep 01", fullDate: "Sep 1, 2026", grossRevenue: 154800, netRevenue: 142600, recoveredRevenue: 31200, fees: 4490, ordersCount: 2280 },
  { date: "Sep 03", fullDate: "Sep 3, 2026", grossRevenue: 149200, netRevenue: 137400, recoveredRevenue: 32800, fees: 4330, ordersCount: 2190 },
  { date: "Today", fullDate: "Sep 4, 2026", grossRevenue: 168450, netRevenue: 154820, recoveredRevenue: 34820, fees: 4890, ordersCount: 2460 },
];

export const MOCK_ORDERS: OrderItem[] = [
  {
    id: "ord_9011",
    orderNumber: "OPS-90114",
    paymentIntentId: "pi_3NpK192eZvKYlo2C1g9941a",
    chargeId: "ch_3NpK192eZvKYlo2C1g9941a",
    customerId: "cus_P019481jKa",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@enterprisecloud.io",
    customerAvatar: "SJ",
    amount: 1450.00,
    fee: 42.05,
    net: 1407.95,
    currency: "USD",
    status: "succeeded",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
      expMonth: 11,
      expYear: 2028,
      funding: "credit",
      issuer: "JPMorgan Chase Bank, N.A.",
    },
    fraudRiskScore: 6,
    riskLevel: "low",
    riskExplanation: "Clean device fingerprint, billing address matches card postal code, normal velocity.",
    riskFactors: ["Cardholder Name Matched", "3DS Frictionless Authentication", "Low Geolocation Discrepancy (0.4 mi)"],
    date: "Sep 04, 2026",
    time: "14:24 UTC",
    itemsCount: 3,
    country: "US",
    ipAddress: "64.233.160.1",
    timeline: [
      { step: "Order Initiated", timestamp: "14:24:02 UTC", status: "completed", detail: "Checkout initiated via API v2" },
      { step: "3D Secure Verified", timestamp: "14:24:04 UTC", status: "completed", detail: "Frictionless authentication approved by issuer" },
      { step: "Payment Authorized", timestamp: "14:24:05 UTC", status: "completed", detail: "Auth code #948214 - Chase Visa" },
      { step: "Funds Captured", timestamp: "14:24:06 UTC", status: "completed", detail: "Automatic capture scheduled" },
      { step: "Settled to Treasury", timestamp: "14:24:08 UTC", status: "completed", detail: "Batch #SVB-0904 allocated" },
    ],
    stripeEvents: [
      { id: "evt_1NpK1A2eZvKYlo2CqO8k2", type: "payment_intent.succeeded", timestamp: "14:24:06 UTC", livemode: true },
      { id: "evt_1NpK192eZvKYlo2CLo188", type: "charge.succeeded", timestamp: "14:24:05 UTC", livemode: true },
      { id: "evt_1NpK182eZvKYlo2C9K011", type: "radar.risk_evaluated", timestamp: "14:24:03 UTC", livemode: true },
    ],
    webhookLogs: [
      { id: "wh_01", url: "https://api.opsmind.io/webhooks/stripe", status: 200, duration: "42ms", timestamp: "14:24:07 UTC" },
      { id: "wh_02", url: "https://integrations.enterprisecloud.io/erp", status: 200, duration: "115ms", timestamp: "14:24:08 UTC" },
    ],
  },
  {
    id: "ord_9012",
    orderNumber: "OPS-90115",
    paymentIntentId: "pi_3NpK202eZvKYlo2C2h1182b",
    chargeId: "ch_3NpK202eZvKYlo2C2h1182b",
    customerId: "cus_Q891276kLb",
    customerName: "Liam Van Der Beek",
    customerEmail: "liam@nordicsolutions.se",
    customerAvatar: "LV",
    amount: 3280.50,
    fee: 95.13,
    net: 3185.37,
    currency: "USD",
    status: "succeeded",
    paymentMethod: {
      brand: "mastercard",
      last4: "8821",
      expMonth: 8,
      expYear: 2027,
      funding: "credit",
      issuer: "Nordea Bank Abp",
    },
    fraudRiskScore: 12,
    riskLevel: "low",
    riskExplanation: "Verified corporate identity. Recurring subscription license expansion.",
    riskFactors: ["Strong Customer Auth (SCA) Verified", "Known Customer Entity", "Zero Past Disputes"],
    date: "Sep 04, 2026",
    time: "14:18 UTC",
    itemsCount: 5,
    country: "SE",
    ipAddress: "193.180.251.10",
    timeline: [
      { step: "Order Initiated", timestamp: "14:18:01 UTC", status: "completed", detail: "Annual SaaS Renewal Contract" },
      { step: "3D Secure Verified", timestamp: "14:18:03 UTC", status: "completed", detail: "BankID signature verified" },
      { step: "Payment Authorized", timestamp: "14:18:04 UTC", status: "completed", detail: "Auth code #772911" },
      { step: "Funds Captured", timestamp: "14:18:05 UTC", status: "completed", detail: "Net $3,185.37 transferred" },
    ],
    stripeEvents: [
      { id: "evt_2NpK2A2eZvKYlo2CqO8k3", type: "payment_intent.succeeded", timestamp: "14:18:05 UTC", livemode: true },
      { id: "evt_2NpK292eZvKYlo2CLo189", type: "charge.succeeded", timestamp: "14:18:04 UTC", livemode: true },
    ],
    webhookLogs: [
      { id: "wh_03", url: "https://api.opsmind.io/webhooks/stripe", status: 200, duration: "38ms", timestamp: "14:18:06 UTC" },
    ],
  },
  {
    id: "ord_9013",
    orderNumber: "OPS-90116",
    paymentIntentId: "pi_3NpK212eZvKYlo2C3i2293c",
    chargeId: "ch_3NpK212eZvKYlo2C3i2293c",
    customerId: "cus_R554219mMc",
    customerName: "Marcus Thorne",
    customerEmail: "m.thorne@apexquantum.co",
    customerAvatar: "MT",
    amount: 890.00,
    fee: 25.81,
    net: 864.19,
    currency: "USD",
    status: "processing",
    paymentMethod: {
      brand: "apple-pay",
      last4: "9102",
      expMonth: 5,
      expYear: 2029,
      funding: "debit",
      issuer: "Barclays Bank UK PLC",
    },
    fraudRiskScore: 28,
    riskLevel: "medium",
    riskExplanation: "New device token authenticated via Apple Biometrics. Settlement clearing in progress.",
    riskFactors: ["Apple Pay Biometric Token", "First-time Buyer", "Domestic UK Transit"],
    date: "Sep 04, 2026",
    time: "14:11 UTC",
    itemsCount: 1,
    country: "GB",
    ipAddress: "82.165.197.1",
    timeline: [
      { step: "Order Initiated", timestamp: "14:11:00 UTC", status: "completed", detail: "Safari TouchID Checkout" },
      { step: "Apple Secure Enclave Decrypted", timestamp: "14:11:02 UTC", status: "completed", detail: "Cryptogram validated" },
      { step: "Payment Authorized", timestamp: "14:11:04 UTC", status: "completed", detail: "Awaiting final settlement capture" },
      { step: "Clearing Settlement", timestamp: "14:11:05 UTC", status: "pending", detail: "Adyen UK rail finalizing batch" },
    ],
    stripeEvents: [
      { id: "evt_3NpK3A2eZvKYlo2CqO8k4", type: "payment_intent.processing", timestamp: "14:11:04 UTC", livemode: true },
    ],
    webhookLogs: [
      { id: "wh_04", url: "https://api.opsmind.io/webhooks/adyen", status: 200, duration: "64ms", timestamp: "14:11:05 UTC" },
    ],
  },
  {
    id: "ord_9014",
    orderNumber: "OPS-90117",
    paymentIntentId: "pi_3NpK222eZvKYlo2C4j3304d",
    chargeId: "ch_3NpK222eZvKYlo2C4j3304d",
    customerId: "cus_S991823nNd",
    customerName: "Elena Rostova",
    customerEmail: "elena.r@fintechscale.de",
    customerAvatar: "ER",
    amount: 5400.00,
    fee: 156.60,
    net: 5243.40,
    currency: "USD",
    status: "pending",
    paymentMethod: {
      brand: "amex",
      last4: "3004",
      expMonth: 12,
      expYear: 2026,
      funding: "credit",
      issuer: "American Express Europe S.A.",
    },
    fraudRiskScore: 19,
    riskLevel: "low",
    riskExplanation: "High-value enterprise order. Manual secondary review completed by Ops Sentinel.",
    riskFactors: ["High Transaction Value", "Amex SafeKey Passed", "Corporate Billing Email"],
    date: "Sep 04, 2026",
    time: "13:58 UTC",
    itemsCount: 8,
    country: "DE",
    ipAddress: "85.214.132.11",
    timeline: [
      { step: "Order Initiated", timestamp: "13:58:00 UTC", status: "completed", detail: "Enterprise Checkout Tier" },
      { step: "Amex SafeKey Authenticated", timestamp: "13:58:02 UTC", status: "completed", detail: "Issuer approved 3DS" },
      { step: "Treasury Inflow Scheduled", timestamp: "13:58:04 UTC", status: "pending", detail: "Pending wire clearing" },
    ],
    stripeEvents: [
      { id: "evt_4NpK4A2eZvKYlo2CqO8k5", type: "payment_intent.requires_capture", timestamp: "13:58:03 UTC", livemode: true },
    ],
    webhookLogs: [
      { id: "wh_05", url: "https://api.opsmind.io/webhooks/stripe", status: 200, duration: "51ms", timestamp: "13:58:04 UTC" },
    ],
  },
  {
    id: "ord_9015",
    orderNumber: "OPS-90118",
    paymentIntentId: "pi_3NpK232eZvKYlo2C5k4415e",
    chargeId: "ch_3NpK232eZvKYlo2C5k4415e",
    customerId: "cus_T001923oOe",
    customerName: "Anonymous Guest",
    customerEmail: "temp9841@protonmail.ch",
    customerAvatar: "AG",
    amount: 2190.00,
    fee: 0,
    net: 0,
    currency: "USD",
    status: "failed",
    paymentMethod: {
      brand: "visa",
      last4: "1190",
      expMonth: 2,
      expYear: 2026,
      funding: "credit",
      issuer: "Bank of America (Suspected Proxy)",
    },
    fraudRiskScore: 94,
    riskLevel: "high",
    riskExplanation: "High-probability card testing attack. TOR exit node, postal code mismatch, velocity violation (12 attempts/10m).",
    riskFactors: ["TOR Exit Node Proxy", "Card Velocity Anomaly (+800%)", "Stolen BIN Sequence Match", "Throwaway Email Domain"],
    date: "Sep 04, 2026",
    time: "13:42 UTC",
    itemsCount: 2,
    country: "NL",
    ipAddress: "185.220.101.44",
    timeline: [
      { step: "Order Initiated", timestamp: "13:42:01 UTC", status: "completed", detail: "Automated browser session detected" },
      { step: "Sentinel AI Screening", timestamp: "13:42:02 UTC", status: "failed", detail: "High risk score (94/100) triggered rule #FR-901" },
      { step: "Transaction Blocked", timestamp: "13:42:03 UTC", status: "failed", detail: "Decline code: card_velocity_exceeded / fraudulent" },
      { step: "Quarantine Applied", timestamp: "13:42:04 UTC", status: "completed", detail: "IP 185.220.101.44 blacklisted for 24h" },
    ],
    stripeEvents: [
      { id: "evt_5NpK5A2eZvKYlo2CqO8k6", type: "charge.failed", timestamp: "13:42:03 UTC", livemode: true },
      { id: "evt_5NpK592eZvKYlo2CLo190", type: "radar.blocked", timestamp: "13:42:02 UTC", livemode: true },
    ],
    webhookLogs: [
      { id: "wh_06", url: "https://api.opsmind.io/webhooks/security", status: 200, duration: "12ms", timestamp: "13:42:04 UTC" },
    ],
    recoveryAttempts: [
      { attempt: 1, date: "Sep 04, 13:42 UTC", method: "Zero-auth probe check", result: "declined" },
    ],
  },
  {
    id: "ord_9016",
    orderNumber: "OPS-90119",
    paymentIntentId: "pi_3NpK242eZvKYlo2C6l5526f",
    chargeId: "ch_3NpK242eZvKYlo2C6l5526f",
    customerId: "cus_U112934pPf",
    customerName: "Hiroshi Tanaka",
    customerEmail: "tanaka@tokyoworks.jp",
    customerAvatar: "HT",
    amount: 760.25,
    fee: 22.05,
    net: 738.20,
    currency: "USD",
    status: "succeeded",
    paymentMethod: {
      brand: "mastercard",
      last4: "4920",
      expMonth: 10,
      expYear: 2028,
      funding: "credit",
      issuer: "Mitsubishi UFJ Financial Group",
    },
    fraudRiskScore: 4,
    riskLevel: "low",
    riskExplanation: "Clean biometric auth via Japanese card issuer. Longstanding repeat customer.",
    riskFactors: ["3DS2 SMS OTP Verified", "Loyalty Tier Member", "Zero Chargeback History"],
    date: "Sep 04, 2026",
    time: "13:20 UTC",
    itemsCount: 2,
    country: "JP",
    ipAddress: "133.242.18.2",
    timeline: [
      { step: "Order Initiated", timestamp: "13:20:00 UTC", status: "completed", detail: "Mobile SDK v3.4" },
      { step: "3D Secure Verified", timestamp: "13:20:02 UTC", status: "completed", detail: "MUFG Bank Authenticated" },
      { step: "Payment Authorized", timestamp: "13:20:03 UTC", status: "completed", detail: "Auth #549102" },
      { step: "Funds Captured", timestamp: "13:20:04 UTC", status: "completed", detail: "Currency JPY -> USD Auto-hedged" },
    ],
    stripeEvents: [
      { id: "evt_6NpK6A2eZvKYlo2CqO8k7", type: "payment_intent.succeeded", timestamp: "13:20:04 UTC", livemode: true },
    ],
    webhookLogs: [
      { id: "wh_07", url: "https://api.opsmind.io/webhooks/stripe", status: 200, duration: "49ms", timestamp: "13:20:05 UTC" },
    ],
  },
  {
    id: "ord_9017",
    orderNumber: "OPS-90120",
    paymentIntentId: "pi_3NpK252eZvKYlo2C7m6637g",
    chargeId: "ch_3NpK252eZvKYlo2C7m6637g",
    customerId: "cus_V223045qQg",
    customerName: "Camila Duarte",
    customerEmail: "c.duarte@rioretail.br",
    customerAvatar: "CD",
    amount: 1120.00,
    fee: 0,
    net: -1120.00,
    currency: "USD",
    status: "refunded",
    paymentMethod: {
      brand: "visa",
      last4: "7763",
      expMonth: 4,
      expYear: 2027,
      funding: "credit",
      issuer: "Banco Itaú Unibanco S.A.",
    },
    fraudRiskScore: 15,
    riskLevel: "low",
    riskExplanation: "Customer requested voluntary subscription cancellation within 14-day statutory grace window.",
    riskFactors: ["Voluntary Merchant Refund", "Customer Service Ticket #CS-4011", "No Dispute Filed"],
    date: "Sep 04, 2026",
    time: "12:55 UTC",
    itemsCount: 2,
    country: "BR",
    ipAddress: "177.18.204.99",
    timeline: [
      { step: "Order Initiated", timestamp: "Aug 28, 10:00 UTC", status: "completed", detail: "Original subscription charge" },
      { step: "Refund Requested", timestamp: "12:50:00 UTC", status: "completed", detail: "Requested via Customer Portal" },
      { step: "Refund Processed", timestamp: "12:55:00 UTC", status: "completed", detail: "Full reversal of $1,120.00 credited to Visa 7763" },
    ],
    stripeEvents: [
      { id: "evt_7NpK7A2eZvKYlo2CqO8k8", type: "charge.refunded", timestamp: "12:55:02 UTC", livemode: true },
    ],
    webhookLogs: [
      { id: "wh_08", url: "https://api.opsmind.io/webhooks/stripe", status: 200, duration: "36ms", timestamp: "12:55:03 UTC" },
    ],
  },
];

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: "ins_1",
    title: "EU Gateway Latency Anomaly Auto-Rerouted",
    summary: "OpsMind detected a +280ms 3DS latency spike on Stripe EU. 214 checkouts dynamically shifted to Adyen with 99.4% authorization rate.",
    impact: "+$18,400 protected GMV",
    metric: "99.4% Auth Rate",
    category: "routing",
    confidence: 98,
    suggestedAction: "Lock Adyen as primary EU fallback for next 6 hours",
    timestamp: "12m ago",
  },
  {
    id: "ins_2",
    title: "Smart Retry Window Recovers 94.2% of Failed Charges",
    summary: "AI timing engine rescheduled morning subscription rebills to 09:15 local time, preventing soft-decline cascade across 48 accounts.",
    impact: "+$8,420 recovered ARR",
    metric: "94.2% Success Rate",
    category: "recovery",
    confidence: 95,
    suggestedAction: "Activate Smart Retry for high-value enterprise tiers",
    timestamp: "45m ago",
  },
  {
    id: "ins_3",
    title: "Coordinated Card Testing Ring Quarantined",
    summary: "Pattern match detected 34 BIN probing attempts using randomized postal codes from ASN 14061. Pre-authorization barrier triggered.",
    impact: "$0 loss, 0 dispute flags",
    metric: "34 Attackers Blocked",
    category: "fraud",
    confidence: 99,
    suggestedAction: "Maintain strict velocity rule on /v1/charges",
    timestamp: "1h ago",
  },
  {
    id: "ins_4",
    title: "Estimated Cash Runway Extended by 1.8 Months",
    summary: "Net operating margin expansion and recovered ARR over the past 30 days pushed total liquid reserves past $1.42M.",
    impact: "18.4 Months Runway",
    metric: "+8.6% Cash Position",
    category: "treasury",
    confidence: 92,
    suggestedAction: "Review Q4 capital deployment forecast",
    timestamp: "3h ago",
  },
];

export const MOCK_CASH_FLOW: CashFlowData = {
  currentLiquidity: 1429800,
  runwayMonths: 18.4,
  safeToSpend: 420000,
  projected30DayNet: 142600,
  upcomingEvents: [
    { id: "cf_1", type: "inflow", title: "Stripe Automated Daily Settlement", amount: 84200, date: "Tomorrow, 06:00 UTC", source: "Stripe US" },
    { id: "cf_2", type: "outflow", title: "Payroll & Contractor Disbursal", amount: 58400, date: "In 4 days (Sep 08)", source: "Gusto / Wise" },
    { id: "cf_3", type: "inflow", title: "Enterprise Annual Contract (Apex Labs)", amount: 48000, date: "In 7 days (Sep 11)", source: "Direct Wire" },
    { id: "cf_4", type: "outflow", title: "AWS Cloud Infrastructure & Compute", amount: 16500, date: "In 10 days (Sep 14)", source: "Corporate Amex" },
  ],
  forecastSeries: [
    { day: "W1", projectedBalance: 1429800, upperBound: 1460000, lowerBound: 1410000, inflow: 112000, outflow: 34000 },
    { day: "W2", projectedBalance: 1507800, upperBound: 1550000, lowerBound: 1470000, inflow: 135000, outflow: 57000 },
    { day: "W3", projectedBalance: 1585800, upperBound: 1640000, lowerBound: 1530000, inflow: 142000, outflow: 64000 },
    { day: "W4", projectedBalance: 1663800, upperBound: 1730000, lowerBound: 1600000, inflow: 158000, outflow: 80000 },
  ],
};

export const MOCK_FRAUD_ALERTS: FraudAlertItem[] = [
  {
    id: "frd_101",
    score: 98,
    level: "critical",
    vector: "TOR Exit Node + Card Velocity Mismatch",
    customer: "ghost_checkout_99@xyz.org",
    amount: 2450.00,
    location: "Frankfurt, DE (Proxy)",
    ip: "185.220.101.44",
    bin: "411111 (US Chase)",
    timestamp: "3m ago",
    status: "blocked",
  },
  {
    id: "frd_102",
    score: 87,
    level: "high",
    vector: "Device Fingerprint Collision (12 cards / 10m)",
    customer: "alex.morris991@fastmail.com",
    amount: 1890.00,
    location: "Amsterdam, NL",
    ip: "194.38.20.11",
    bin: "542418 (UK Barclays)",
    timestamp: "18m ago",
    status: "quarantined",
  },
  {
    id: "frd_103",
    score: 74,
    level: "medium",
    vector: "High-Value First Order + Shipping Mismatch",
    customer: "david.w@titanlogistics.co",
    amount: 4200.00,
    location: "Miami, FL, US",
    ip: "72.229.28.190",
    bin: "378282 (US Amex)",
    timestamp: "42m ago",
    status: "flagged",
  },
  {
    id: "frd_104",
    score: 92,
    level: "critical",
    vector: "Stolen BIN Attack Wave (Automated Bot)",
    customer: "automated_script_2@binprobe.cc",
    amount: 890.00,
    location: "Bucharest, RO",
    ip: "89.40.181.2",
    bin: "400022 (FR BNP)",
    timestamp: "1h ago",
    status: "blocked",
  },
];

export const MOCK_FAILED_PAYMENTS: FailedPaymentItem[] = [
  {
    id: "fail_01",
    customer: "Quantum Dynamics Ltd",
    email: "billing@quantumdynamics.io",
    amount: 2840.00,
    declineCode: "insufficient_funds",
    declineReason: "Soft Decline (Available balance low)",
    gateway: "Stripe US",
    attempts: 1,
    nextRetry: "Today at 18:30 UTC",
    recoveryProbability: 92,
    status: "scheduled",
  },
  {
    id: "fail_02",
    customer: "Nordic Media Group",
    email: "finance@nordicmedia.dk",
    amount: 4190.50,
    declineCode: "do_not_honor",
    declineReason: "Bank 3DS Authentication Timeout",
    gateway: "Adyen EU",
    attempts: 2,
    nextRetry: "Recovering via backup card",
    recoveryProbability: 84,
    status: "recovering",
  },
  {
    id: "fail_03",
    customer: "Solaris Ventures",
    email: "pay@solarisventures.com",
    amount: 1520.00,
    declineCode: "card_velocity_exceeded",
    declineReason: "Temporary Issuer Velocity Restriction",
    gateway: "Stripe US",
    attempts: 1,
    nextRetry: "Tomorrow at 09:00 UTC",
    recoveryProbability: 96,
    status: "scheduled",
  },
  {
    id: "fail_04",
    customer: "Apex Retailers Inc",
    email: "accounts@apexretail.co",
    amount: 3480.00,
    declineCode: "expired_card",
    declineReason: "Card Expired (08/26)",
    gateway: "Stripe US",
    attempts: 3,
    nextRetry: "Smart link SMS sent",
    recoveryProbability: 71,
    status: "scheduled",
  },
];

export const MOCK_ACTIVITIES: ActivityTimelineItem[] = [
  {
    id: "act_1",
    title: "AI Smart Route Rerouted 214 EU Orders",
    description: "Switched traffic away from degraded Stripe EU endpoint to Adyen Amsterdam.",
    actor: "OpsMind Agent Copilot",
    actorType: "ai",
    timestamp: "5m ago",
    type: "payment",
    metadata: "214 transactions • 0 dropped",
  },
  {
    id: "act_2",
    title: "Automatic Fraud Rule Fired: ASN-14061 Quarantined",
    description: "Blocked 34 rapid card tests targeting the guest checkout endpoint.",
    actor: "Fraud Sentinel AI",
    actorType: "ai",
    timestamp: "18m ago",
    type: "fraud",
    metadata: "$86,410 prevented exposure",
  },
  {
    id: "act_3",
    title: "Payment Recovered: $1,840.00",
    description: "CloudTech Partners invoice recovered on smart schedule retry #2.",
    actor: "Smart Retry Engine",
    actorType: "system",
    timestamp: "32m ago",
    type: "recovery",
    metadata: "Invoice #INV-4920",
  },
  {
    id: "act_4",
    title: "Treasury Daily Settlement Complete",
    description: "Net proceeds of $89,420.10 deposited to SVB Treasury Account.",
    actor: "Stripe Settlement Hook",
    actorType: "system",
    timestamp: "2h ago",
    type: "forecast",
    metadata: "Trace ID: str_tr_991823",
  },
  {
    id: "act_5",
    title: "Risk Threshold Updated by Alex Vance",
    description: "Tightened high-velocity risk scoring parameter for cross-border transactions.",
    actor: "Alex Vance (Lead Ops)",
    actorType: "user",
    timestamp: "4h ago",
    type: "settings",
    metadata: "Score cutoff: 75 -> 70",
  },
];

export const COPILOT_SUGGESTED_PROMPTS = [
  "Why is revenue dropping?",
  "Show fraud spikes",
  "Recover failed payments",
  "Forecast next month",
];

// CSV Exporter Utility function
export function downloadCSV<T extends object>(filename: string, rows: T[]) {
  if (!rows || !rows.length) return;
  const separator = ",";
  const firstRow = rows[0] as Record<string, unknown>;
  const keys = Object.keys(firstRow);
  const csvContent =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) => {
        const record = row as Record<string, unknown>;
        return keys
          .map((k) => {
            const rawVal = record[k];
            let cell = rawVal === null || rawVal === undefined ? "" : String(rawVal);
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
