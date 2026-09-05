import { NextRequest } from 'next/server'
import { successResponse, errorResponse, handleApiError } from '@/lib/api'
import { DashboardService } from '@/services/dashboard-service'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('opsmind_session')?.value
    if (!token) {
      return errorResponse('Unauthorized', 401)
    }

    const notifications = await DashboardService.getNotifications()

    return successResponse(notifications)
  } catch (error) {
    return handleApiError(error)
  }
}