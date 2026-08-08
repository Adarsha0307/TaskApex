import { NextRequest, NextResponse } from 'next/server'
import { createSession, hashPassword, verifyPassword } from '@/lib/auth'

// In-memory user store (replace with database in production)
const users = new Map<string, { id: string; username: string; password: string; devices: Set<string> }>()

export async function POST(request: NextRequest) {
  try {
    const { userId, password, action } = await request.json()

    if (action === 'register') {
      if (users.has(userId)) {
        return NextResponse.json({ error: 'User ID already exists' }, { status: 400 })
      }

      if (!userId || !password) {
        return NextResponse.json({ error: 'User ID and password required' }, { status: 400 })
      }

      const hashedPassword = await hashPassword(password)
      const user = {
        id: userId,
        username: userId,
        password: hashedPassword,
        devices: new Set<string>(),
      }
      users.set(userId, user)

      // Generate device ID for this session
      const deviceId = crypto.randomUUID()
      user.devices.add(deviceId)

      await createSession({ userId: user.id, username: user.username, deviceId })

      return NextResponse.json({ success: true, userId: user.id })
    }

    if (action === 'login') {
      const user = users.get(userId)
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const isValid = await verifyPassword(password, user.password)
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // Generate device ID for this session
      const deviceId = crypto.randomUUID()
      user.devices.add(deviceId)

      await createSession({ userId: user.id, username: user.username, deviceId })

      return NextResponse.json({ success: true, userId: user.id })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}