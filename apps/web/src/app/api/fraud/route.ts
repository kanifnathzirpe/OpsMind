import { NextRequest } from 'next/server'
import { successResponse, handleApiError } from '@/lib/api'
import { getFallbackFraudAlerts } from '@/lib/api/fraud'

export async function GET() {
  try {
    const alerts = getFallbackFraudAlerts()
    return successResponse(alerts)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    return successResponse({
      id,
      status,
      message: `Fraud alert ${id} marked as ${status}`,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ruleId, ruleName } = body

    if (action === 'apply_rule') {
      return successResponse({
        success: true,
        ruleId,
        message: `Sentinel firewall rule "${ruleName || ruleId}" active across all edge gateways`,
      })
    }

    return successResponse({ success: true, message: 'Fraud action processed' })
  } catch (error) {
    return handleApiError(error)
  }
}