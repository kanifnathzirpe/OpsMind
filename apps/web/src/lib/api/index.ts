import { NextResponse } from 'next/server'
import { ApiError } from './api-client'

export {
  apiClient,
  ApiClient,
  ApiError,
  mockFetch,
  simulateNetworkDelay,
  type ApiResponse,
  type RequestOptions,
} from './api-client'

export * from './dashboard'
export * from './orders'
export * from './customers'
export * from './payments'
export * from './fraud'
export * from './forecast'
export * from './copilot'
export * from './revenue'
export * from './notifications'
export * from './settings'

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ data, status, success: true }, { status })
}

export function errorResponse(message: string, status: number = 500, details?: unknown) {
  return NextResponse.json({ error: message, status, success: false, details }, { status })
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode, error.details)
  }
  
  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }
  
  return errorResponse('An unexpected error occurred', 500)
}
