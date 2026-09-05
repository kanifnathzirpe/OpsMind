import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-global' },
    update: {},
    create: {
      name: 'Acme Global Direct',
      slug: 'acme-global',
      plan: 'enterprise',
    },
  })

  console.log(`✅ Created organization: ${org.name}`)

  // Create User
  const user = await prisma.user.upsert({
    where: { clerkId: 'user_123' },
    update: {},
    create: {
      clerkId: 'user_123',
      email: 'admin@acme.com',
      name: 'Admin User',
      role: 'admin',
      organizationId: org.id,
    },
  })

  console.log(`✅ Created user: ${user.email}`)

  // Create Merchants
  const merchants = await Promise.all([
    prisma.merchant.upsert({
      where: { code: 'ACME-GL' },
      update: {},
      create: {
        name: 'Acme Global Direct',
        code: 'ACME-GL',
        region: 'North America (USD)',
        currency: 'USD',
        currencySymbol: '$',
        status: 'active',
        multiplier: 1.0,
        organizationId: org.id,
      },
    }),
    prisma.merchant.upsert({
      where: { code: 'APEX-EU' },
      update: {},
      create: {
        name: 'Apex Labs Europe',
        code: 'APEX-EU',
        region: 'Europe (EUR)',
        currency: 'EUR',
        currencySymbol: '€',
        status: 'active',
        multiplier: 0.92,
        organizationId: org.id,
      },
    }),
    prisma.merchant.upsert({
      where: { code: 'HS-UK' },
      update: {},
      create: {
        name: 'HyperScale Retail UK',
        code: 'HS-UK',
        region: 'United Kingdom (GBP)',
        currency: 'GBP',
        currencySymbol: '£',
        status: 'active',
        multiplier: 0.78,
        organizationId: org.id,
      },
    }),
    prisma.merchant.upsert({
      where: { code: 'STAR-SBX' },
      update: {},
      create: {
        name: 'Starlight Sandbox',
        code: 'STAR-SBX',
        region: 'Global Test',
        currency: 'USD',
        currencySymbol: '$',
        status: 'sandbox',
        multiplier: 0.15,
        organizationId: org.id,
      },
    }),
  ])

  console.log(`✅ Created ${merchants.length} merchants`)

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { id: 'cus_1' },
      update: {},
      create: {
        id: 'cus_1',
        name: 'Sarah Jenkins',
        email: 'sarah.j@enterprisecloud.io',
        avatar: 'SJ',
        organizationId: org.id,
      },
    }),
    prisma.customer.upsert({
      where: { id: 'cus_2' },
      update: {},
      create: {
        id: 'cus_2',
        name: 'Liam Van Der Beek',
        email: 'liam@nordicsolutions.se',
        avatar: 'LV',
        organizationId: org.id,
      },
    }),
    prisma.customer.upsert({
      where: { id: 'cus_3' },
      update: {},
      create: {
        id: 'cus_3',
        name: 'Marcus Thorne',
        email: 'm.thorne@apexquantum.co',
        avatar: 'MT',
        organizationId: org.id,
      },
    }),
  ])

  console.log(`✅ Created ${customers.length} customers`)

  // Create Orders
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { orderNumber: 'OPS-90114' },
      update: {},
      create: {
        orderNumber: 'OPS-90114',
        paymentIntentId: 'pi_3NpK192eZvKYlo2C1g9941a',
        chargeId: 'ch_3NpK192eZvKYlo2C1g9941a',
        customerId: customers[0].id,
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.j@enterprisecloud.io',
        customerAvatar: 'SJ',
        amount: 1450.00,
        fee: 42.05,
        net: 1407.95,
        currency: 'USD',
        status: 'succeeded',
        itemsCount: 3,
        country: 'US',
        ipAddress: '64.233.160.1',
        merchantId: merchants[0].id,
        organizationId: org.id,
        paymentMethod: JSON.stringify({
          brand: 'visa',
          last4: '4242',
          expMonth: 11,
          expYear: 2028,
          funding: 'credit',
          issuer: 'JPMorgan Chase Bank, N.A.',
        }),
        fraudRiskScore: 6,
        riskLevel: 'low',
        riskExplanation: 'Clean device fingerprint, billing address matches card postal code, normal velocity.',
        riskFactors: JSON.stringify(['Cardholder Name Matched', '3DS Frictionless Authentication', 'Low Geolocation Discrepancy (0.4 mi)']),
        timeline: JSON.stringify([
          { step: 'Order Initiated', timestamp: '14:24:02 UTC', status: 'completed', detail: 'Checkout initiated via API v2' },
          { step: '3D Secure Verified', timestamp: '14:24:04 UTC', status: 'completed', detail: 'Frictionless authentication approved by issuer' },
          { step: 'Payment Authorized', timestamp: '14:24:05 UTC', status: 'completed', detail: 'Auth code #948214 - Chase Visa' },
          { step: 'Funds Captured', timestamp: '14:24:06 UTC', status: 'completed', detail: 'Automatic capture scheduled' },
          { step: 'Settled to Treasury', timestamp: '14:24:08 UTC', status: 'completed', detail: 'Batch #SVB-0904 allocated' },
        ]),
        stripeEvents: JSON.stringify([
          { id: 'evt_1NpK1A2eZvKYlo2CqO8k2', type: 'payment_intent.succeeded', timestamp: '14:24:06 UTC', livemode: true },
          { id: 'evt_1NpK192eZvKYlo2CLo188', type: 'charge.succeeded', timestamp: '14:24:05 UTC', livemode: true },
          { id: 'evt_1NpK182eZvKYlo2C9K011', type: 'radar.risk_evaluated', timestamp: '14:24:03 UTC', livemode: true },
        ]),
        webhookLogs: JSON.stringify([
          { id: 'wh_01', url: 'https://api.opsmind.io/webhooks/stripe', status: 200, duration: '42ms', timestamp: '14:24:07 UTC' },
          { id: 'wh_02', url: 'https://integrations.enterprisecloud.io/erp', status: 200, duration: '115ms', timestamp: '14:24:08 UTC' },
        ]),
      },
    }),
    prisma.order.upsert({
      where: { orderNumber: 'OPS-90115' },
      update: {},
      create: {
        orderNumber: 'OPS-90115',
        paymentIntentId: 'pi_3NpK202eZvKYlo2C2h1182b',
        chargeId: 'ch_3NpK202eZvKYlo2C2h1182b',
        customerId: customers[1].id,
        customerName: 'Liam Van Der Beek',
        customerEmail: 'liam@nordicsolutions.se',
        customerAvatar: 'LV',
        amount: 3280.50,
        fee: 95.13,
        net: 3185.37,
        currency: 'USD',
        status: 'succeeded',
        itemsCount: 5,
        country: 'SE',
        ipAddress: '193.180.251.10',
        merchantId: merchants[0].id,
        organizationId: org.id,
        paymentMethod: JSON.stringify({
          brand: 'mastercard',
          last4: '8821',
          expMonth: 8,
          expYear: 2027,
          funding: 'credit',
          issuer: 'Nordea Bank Abp',
        }),
        fraudRiskScore: 12,
        riskLevel: 'low',
        riskExplanation: 'Verified corporate identity. Recurring subscription license expansion.',
        riskFactors: JSON.stringify(['Strong Customer Auth (SCA) Verified', 'Known Customer Entity', 'Zero Past Disputes']),
        timeline: JSON.stringify([
          { step: 'Order Initiated', timestamp: '14:18:01 UTC', status: 'completed', detail: 'Annual SaaS Renewal Contract' },
          { step: '3D Secure Verified', timestamp: '14:18:03 UTC', status: 'completed', detail: 'BankID signature verified' },
          { step: 'Payment Authorized', timestamp: '14:18:04 UTC', status: 'completed', detail: 'Auth code #772911' },
          { step: 'Funds Captured', timestamp: '14:18:05 UTC', status: 'completed', detail: 'Net $3,185.37 transferred' },
        ]),
        stripeEvents: JSON.stringify([
          { id: 'evt_2NpK2A2eZvKYlo2CqO8k3', type: 'payment_intent.succeeded', timestamp: '14:18:05 UTC', livemode: true },
          { id: 'evt_2NpK292eZvKYlo2CLo189', type: 'charge.succeeded', timestamp: '14:18:04 UTC', livemode: true },
        ]),
        webhookLogs: JSON.stringify([
          { id: 'wh_03', url: 'https://api.opsmind.io/webhooks/stripe', status: 200, duration: '38ms', timestamp: '14:18:06 UTC' },
        ]),
      },
    }),
  ])

  console.log(`✅ Created ${orders.length} orders`)

  // Create Fraud Alerts
  const fraudAlerts = await Promise.all([
    prisma.fraudAlert.upsert({
      where: { id: 'frd_101' },
      update: {},
      create: {
        id: 'frd_101',
        score: 98,
        level: 'critical',
        vector: 'TOR Exit Node + Card Velocity Mismatch',
        customer: 'ghost_checkout_99@xyz.org',
        amount: 2450.00,
        location: 'Frankfurt, DE (Proxy)',
        ip: '185.220.101.44',
        bin: '411111 (US Chase)',
        status: 'blocked',
        merchantId: merchants[0].id,
        organizationId: org.id,
        explanation: 'High-probability card testing attack. TOR exit node, postal code mismatch, velocity violation.',
        factors: JSON.stringify(['TOR Exit Node Proxy', 'Card Velocity Anomaly (+800%)', 'Stolen BIN Sequence Match', 'Throwaway Email Domain']),
      },
    }),
    prisma.fraudAlert.upsert({
      where: { id: 'frd_102' },
      update: {},
      create: {
        id: 'frd_102',
        score: 87,
        level: 'high',
        vector: 'Device Fingerprint Collision (12 cards / 10m)',
        customer: 'alex.morris991@fastmail.com',
        amount: 1890.00,
        location: 'Amsterdam, NL',
        ip: '194.38.20.11',
        bin: '542418 (UK Barclays)',
        status: 'quarantined',
        merchantId: merchants[0].id,
        organizationId: org.id,
        explanation: 'Multiple card attempts from same device fingerprint within short time window.',
        factors: JSON.stringify(['Device Fingerprint Collision', 'Velocity Anomaly', 'Suspicious Geographic Pattern']),
      },
    }),
  ])

  console.log(`✅ Created ${fraudAlerts.length} fraud alerts`)

  // Create AI Insights
  const aiInsights = await Promise.all([
    prisma.aIInsight.upsert({
      where: { id: 'ins_1' },
      update: {},
      create: {
        id: 'ins_1',
        title: 'EU Gateway Latency Anomaly Auto-Rerouted',
        summary: 'OpsMind detected a +280ms 3DS latency spike on Stripe EU. 214 checkouts dynamically shifted to Adyen with 99.4% authorization rate.',
        impact: '+$18,400 protected GMV',
        metric: '99.4% Auth Rate',
        category: 'routing',
        confidence: 98,
        suggestedAction: 'Lock Adyen as primary EU fallback for next 6 hours',
        organizationId: org.id,
      },
    }),
    prisma.aIInsight.upsert({
      where: { id: 'ins_2' },
      update: {},
      create: {
        id: 'ins_2',
        title: 'Smart Retry Window Recovers 94.2% of Failed Charges',
        summary: 'AI timing engine rescheduled morning subscription rebills to 09:15 local time, preventing soft-decline cascade across 48 accounts.',
        impact: '+$8,420 recovered ARR',
        metric: '94.2% Success Rate',
        category: 'recovery',
        confidence: 95,
        suggestedAction: 'Activate Smart Retry for high-value enterprise tiers',
        organizationId: org.id,
      },
    }),
  ])

  console.log(`✅ Created ${aiInsights.length} AI insights`)

  // Create Notifications
  const notifications = await Promise.all([
    prisma.notification.upsert({
      where: { id: 'notif_1' },
      update: {},
      create: {
        id: 'notif_1',
        title: 'Velocity Spike Intercepted',
        description: 'Blocked 14 rapid-fire card testing attempts from IP block 185.220.101.xx',
        category: 'fraud',
        read: false,
        userId: user.id,
      },
    }),
    prisma.notification.upsert({
      where: { id: 'notif_2' },
      update: {},
      create: {
        id: 'notif_2',
        title: 'Automatic Recovery Succeeded',
        description: 'Recovered $1,840.00 failed invoice for CloudTech Partners on retry cycle 2',
        category: 'recovery',
        read: false,
        userId: user.id,
      },
    }),
  ])

  console.log(`✅ Created ${notifications.length} notifications`)

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
