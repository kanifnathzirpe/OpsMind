// Database types derived from Prisma schema
export type User = {
  id: string
  clerkId: string
  email: string
  name: string | null
  avatar: string | null
  role: string
  organizationId: string | null
  createdAt: Date
  updatedAt: Date
}

export type Organization = {
  id: string
  name: string
  slug: string
  plan: string
  createdAt: Date
  updatedAt: Date
}

export type Merchant = {
  id: string
  name: string
  code: string
  region: string
  currency: string
  currencySymbol: string
  status: string
  multiplier: number
  organizationId: string
  createdAt: Date
  updatedAt: Date
}

export type Customer = {
  id: string
  name: string
  email: string
  avatar: string | null
  phone: string | null
  address: string | null
  organizationId: string
  createdAt: Date
  updatedAt: Date
}

export type Order = {
  id: string
  orderNumber: string
  paymentIntentId: string
  chargeId: string | null
  customerId: string
  customerName: string
  customerEmail: string
  customerAvatar: string | null
  amount: number
  fee: number
  net: number
  currency: string
  status: string
  itemsCount: number
  country: string | null
  ipAddress: string | null
  merchantId: string
  organizationId: string
  paymentMethod: string | null
  fraudRiskScore: number
  riskLevel: string | null
  riskExplanation: string | null
  riskFactors: string | null
  timeline: string | null
  stripeEvents: string | null
  webhookLogs: string | null
  createdAt: Date
  updatedAt: Date
}

export type Transaction = {
  id: string
  orderId: string
  merchantId: string
  type: string
  amount: number
  currency: string
  status: string
  gateway: string | null
  gatewayId: string | null
  metadata: string | null
  createdAt: Date
  updatedAt: Date
}

export type FraudAlert = {
  id: string
  score: number
  level: string
  vector: string
  customer: string
  amount: number
  location: string | null
  ip: string | null
  bin: string | null
  status: string
  merchantId: string
  organizationId: string
  orderId: string | null
  explanation: string | null
  factors: string | null
  createdAt: Date
  updatedAt: Date
}

export type Notification = {
  id: string
  title: string
  description: string
  category: string
  read: boolean
  userId: string
  metadata: string | null
  createdAt: Date
  updatedAt: Date
}

export type AIInsight = {
  id: string
  title: string
  summary: string
  impact: string
  metric: string
  category: string
  confidence: number
  suggestedAction: string
  isApplied: boolean
  organizationId: string
  metadata: string | null
  createdAt: Date
  updatedAt: Date
}

export type RecoveryEvent = {
  id: string
  orderId: string
  merchantId: string
  attempt: number
  date: Date
  method: string
  result: string
  amount: number | null
  createdAt: Date
  updatedAt: Date
}

export type AuditLog = {
  id: string
  action: string
  entity: string
  entityId: string | null
  changes: string | null
  userId: string
  organizationId: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}
