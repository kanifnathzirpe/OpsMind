import { NextRequest } from 'next/server'
import { successResponse, handleApiError } from '@/lib/api'
import { getFallbackForecast, getFallbackRevenueSeries } from '@/lib/api/forecast'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')

    if (type === 'revenue') {
      const revenueSeries = getFallbackRevenueSeries()
      return successResponse(revenueSeries)
    }

    const forecastData = getFallbackForecast()
    return successResponse(forecastData)
  } catch (error) {
    return handleApiError(error)
  }
}
