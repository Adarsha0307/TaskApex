import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const tasks = new Map<string, Array<{ id: string; userId: string; text: string; completed: boolean; createdAt: string }>>()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const { completed } = await request.json()
    const userTasks = tasks.get(session.userId) || []
    const taskIndex = userTasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    userTasks[taskIndex] = { ...userTasks[taskIndex], completed }
    tasks.set(session.userId, userTasks)

    return NextResponse.json({ task: userTasks[taskIndex] })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const userTasks = tasks.get(session.userId) || []
  const filteredTasks = userTasks.filter(t => t.id !== id)

  if (filteredTasks.length === userTasks.length) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  tasks.set(session.userId, filteredTasks)
  return NextResponse.json({ success: true })
}