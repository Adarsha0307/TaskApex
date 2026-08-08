import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// In-memory task store (replace with database in production)
const tasks = new Map<string, Array<{ id: string; userId: string; text: string; completed: boolean; createdAt: string }>>()

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userTasks = tasks.get(session.userId) || []
  return NextResponse.json({ tasks: userTasks })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { text } = await request.json()
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Task text required' }, { status: 400 })
    }

    const userTasks = tasks.get(session.userId) || []
    const newTask = {
      id: crypto.randomUUID(),
      userId: session.userId,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    userTasks.push(newTask)
    tasks.set(session.userId, userTasks)

    return NextResponse.json({ task: newTask })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}