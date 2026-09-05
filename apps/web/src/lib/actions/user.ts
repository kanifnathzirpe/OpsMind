'use server'

import { prisma } from '../prisma'
import { getCurrentUser, syncUserWithDatabase } from '../auth'

export async function getCurrentUserAction() {
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

export async function syncUserAction() {
  try {
    const user = await syncUserWithDatabase()
    return { success: true, user }
  } catch (error) {
    console.error('Failed to sync user:', error)
    return { success: false, error: 'Failed to sync user' }
  }
}

export async function updateUserAction(data: { name?: string; avatar?: string }) {
  const user = await getCurrentUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const updated = await prisma.user.updateMany({
      where: { email: user.email },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.avatar && { avatar: data.avatar }),
      },
    })

    return { success: true, count: updated.count }
  } catch (error) {
    console.error('Failed to update user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}
