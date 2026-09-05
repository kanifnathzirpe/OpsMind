import { NextRequest } from 'next/server'
import { successResponse, handleApiError } from '@/lib/api'
import { getFallbackCopilotResponse } from '@/lib/api/copilot'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt = '', action } = body

    const aiResponse = getFallbackCopilotResponse(prompt, action)

    return successResponse(aiResponse)
  } catch (error) {
    return handleApiError(error)
  }
}
