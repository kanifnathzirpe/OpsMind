'use server'

import { prisma } from '../prisma'
import { getCurrentUser } from '../auth'

export async function getMerchantsAction() {
  const user = await getCurrentUser()
  if (!user?.organizationId) return []

  try {
    const merchants = await prisma.merchant.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { name: 'asc' },
    })
    return merchants
  } catch {
    return []
  }
}

export async function getMerchantAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return null

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: { orders: true, transactions: true },
    })
    return merchant
  } catch {
    return null
  }
}

export async function createMerchantAction(data: {
  name: string
  code: string
  region: string
  currency: string
  currencySymbol: string
  status: string
  multiplier: number
}) {
  const user = await getCurrentUser()
  if (!user?.organizationId) return { success: false, error: 'Unauthorized' }

  try {
    const merchant = await prisma.merchant.create({
      data: {
        ...data,
        organizationId: user.organizationId,
      },
    })

    return { success: true, merchant }
  } catch (error) {
    console.error('Failed to create merchant:', error)
    return { success: false, error: 'Failed to create merchant' }
  }
}
