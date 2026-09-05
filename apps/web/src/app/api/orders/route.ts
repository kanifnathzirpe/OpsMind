import { NextRequest } from 'next/server'
import { successResponse, handleApiError } from '@/lib/api'
import { getFallbackOrders } from '@/lib/api/orders'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const merchantId = searchParams.get('merchantId') || undefined
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined

    const orders = getFallbackOrders({
      merchantId,
      search,
      status,
      limit,
    })

    return successResponse(orders)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, orderId } = body

    if (action === 'refund') {
      return successResponse({
        success: true,
        orderId,
        status: 'refunded',
        message: `Order ${orderId} refunded successfully`,
      })
    }

    return successResponse({ success: true, message: 'Action processed' })
  } catch (error) {
    return handleApiError(error)
  }
}