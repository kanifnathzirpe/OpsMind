import { NextRequest } from 'next/server'
import { successResponse, handleApiError } from '@/lib/api'
import { getFallbackDashboardData } from '@/lib/api/dashboard'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const merchantId = searchParams.get('merchantId') || 'm_1'

    // Return realistic scaled dashboard data
    const dashboardData = getFallbackDashboardData(merchantId)

    return successResponse(dashboardData)
  } catch (error) {
    return handleApiError(error)
  }
}
