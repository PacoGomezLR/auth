import { DEMO_MODE, demoSession } from '@/lib/demo'

/**
 * Drop-in replacement for auth() that returns a fake session in demo mode.
 * Uses dynamic import so @/auth (and therefore Prisma) is never loaded
 * when NEXT_PUBLIC_DEMO_MODE=true.
 */
export async function getSession() {
    if (DEMO_MODE) return demoSession
    const { auth } = await import('@/auth')
    return auth()
}
