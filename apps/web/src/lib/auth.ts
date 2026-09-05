import { cookies } from 'next/headers'
import { prisma } from './prisma'

export interface AuthSessionUser {
  id: string
  email: string
  name?: string | null
  avatar?: string | null
  role: string
  organizationId: string
}

export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('opsmind_session')?.value
    if (!token) return null

    // For demo/production fallback: return user
    return {
      id: 'usr_demo_1',
      email: 'alex@opsmind.io',
      name: 'Alex Vance',
      avatar: 'AV',
      role: 'admin',
      organizationId: 'org-acme',
    }
  } catch {
    return null
  }
}

export async function syncUserWithDatabase() {
  const user = await getCurrentUser()
  if (!user) return null

  try {
    const dbUser = await prisma.user.findFirst({
      where: { email: user.email },
      include: { organization: true },
    })

    return dbUser
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<string> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user.id
}
