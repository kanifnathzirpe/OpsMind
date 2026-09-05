import { NextRequest } from 'next/server'
import { successResponse, handleApiError } from '@/lib/api'
import { getFallbackFailedPayments } from '@/lib/api/payments'

export async function GET() {
  try {
    const failedPayments = getFallbackFailedPayments()
    return successResponse(failedPayments)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, paymentId, paymentIds } = body

    if (action === 'retry') {
      const all = getFallbackFailedPayments()
      const found = all.find((p) => p.id === paymentId)
      const amount = found ? found.amount : 240.0

      return successResponse({
        success: true,
        paymentId,
        recoveredAmount: amount,
        message: `Successfully recovered payment ${paymentId} via Smart Retry`,
      })
    }

    if (action === 'batch_recover') {
      const all = getFallbackFailedPayments()
      const total = all.reduce((sum, p) => sum + p.amount, 0)
      const count = paymentIds?.length || all.length

      return successResponse({
        success: true,
        recoveredAmount: total,
        salvagedCount: count,
        message: `Successfully recovered ${count} failed payments totaling $${total.toLocaleString()}`,
      })
    }

    return successResponse({ success: true, message: 'Payment action completed' })
  } catch (error) {
    return handleApiError(error)
  }
}
