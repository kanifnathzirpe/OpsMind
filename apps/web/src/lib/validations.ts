import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
})

// Merchant schemas
export const merchantSchema = z.object({
  name: z.string().min(2, 'Merchant name must be at least 2 characters'),
  code: z.string().min(2, 'Merchant code must be at least 2 characters'),
  region: z.string().min(2, 'Region must be at least 2 characters'),
  currency: z.string().min(3, 'Currency code must be 3 characters'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  status: z.enum(['active', 'sandbox']),
  multiplier: z.number().min(0, 'Multiplier must be positive'),
})

// Order schemas
export const orderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  chargeId: z.string().optional(),
  customerId: z.string().min(1, 'Customer ID is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid customer email'),
  customerAvatar: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  fee: z.number().min(0, 'Fee must be non-negative'),
  net: z.number().min(0, 'Net must be non-negative'),
  currency: z.string().min(3, 'Currency code must be 3 characters'),
  status: z.enum(['succeeded', 'pending', 'processing', 'failed', 'refunded']),
  itemsCount: z.number().int().min(0, 'Items count must be non-negative'),
  country: z.string().optional(),
  ipAddress: z.string().optional(),
  merchantId: z.string().min(1, 'Merchant ID is required'),
  paymentMethod: z.object({
    brand: z.enum(['visa', 'mastercard', 'amex', 'apple-pay']),
    last4: z.string().length(4, 'Last 4 must be 4 characters'),
    expMonth: z.number().int().min(1).max(12),
    expYear: z.number().int().min(new Date().getFullYear()),
    funding: z.enum(['credit', 'debit']),
    issuer: z.string(),
  }).optional(),
  fraudRiskScore: z.number().int().min(0).max(100).default(0),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  riskExplanation: z.string().optional(),
  riskFactors: z.array(z.string()).optional(),
  timeline: z.array(z.object({
    step: z.string(),
    timestamp: z.string(),
    status: z.enum(['completed', 'failed', 'pending']),
    detail: z.string(),
  })).optional(),
  stripeEvents: z.array(z.object({
    id: z.string(),
    type: z.string(),
    timestamp: z.string(),
    livemode: z.boolean(),
  })).optional(),
  webhookLogs: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
    status: z.number(),
    duration: z.string(),
    timestamp: z.string(),
  })).optional(),
})

// Copilot schemas
export const copilotSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  action: z.enum(['analyze_revenue', 'analyze_fraud', 'recover_payments', 'general']).optional(),
})

// Notification schemas
export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['fraud', 'revenue', 'recovery', 'ai', 'system']),
  read: z.boolean().default(false),
})

// API query schemas
export const dashboardQuerySchema = z.object({
  merchantId: z.string().optional(),
})

export const ordersQuerySchema = z.object({
  search: z.string().optional(),
  merchantId: z.string().optional(),
  status: z.enum(['succeeded', 'pending', 'processing', 'failed', 'refunded']).optional(),
})

export const fraudQuerySchema = z.object({
  merchantId: z.string().optional(),
  status: z.enum(['blocked', 'flagged', 'quarantined']).optional(),
})

export const notificationsQuerySchema = z.object({
  unreadOnly: z.enum(['true', 'false']).optional(),
})

export const revenueQuerySchema = z.object({
  merchantId: z.string().optional(),
  days: z.string().regex(/^\d+$/).optional(),
})
