import { NextRequest } from 'next/server'
import { successResponse, errorResponse, handleApiError } from '@/lib/api'
import { DashboardService } from '@/services/dashboard-service'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('opsmind_session')?.value
    if (!token) {
      return errorResponse('Unauthorized', 401)
    }

    const searchParams = request.nextUrl.searchParams
    const merchantId = searchParams.get('merchantId') || 'org-acme'

    const forecast = await DashboardService.getForecast(merchantId)

    return successResponse(forecast)
  } catch (error) {
    return handleApiError(error)
  }
}