import { NextRequest } from 'next/server'
import { successResponse, handleApiError } from '@/lib/api'
import { getFallbackCustomers } from '@/lib/api/customers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || undefined

    const customers = getFallbackCustomers(search)

    return successResponse(customers)
  } catch (error) {
    return handleApiError(error)
  }
}
