'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SessionPayload {
  userId: string
  username: string
  deviceId: string
}

interface DashboardContentProps {
  session: SessionPayload
}

export function DashboardContent({ session }: DashboardContentProps) {
  const [tasks, setTasks] = useState<Array<{ id: string; text: string; completed: boolean }>>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch {
      // Failed to load tasks
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim() || loading) return

    setLoading(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTask.trim() }),
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(prev => [...prev, data.task])
        setNewTask('')
      }
    } catch {
      // Failed to add task
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      if (response.ok) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t))
      }
    } catch {
      // Failed to update task
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== id))
      }
    } catch {
      // Failed to delete task
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold">TaskApex</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
                <span className="text-xs text-gray-400">User:</span>
                <span className="font-mono text-sm text-white">{session.userId}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">Welcome back, <span className="text-blue-400">{session.userId}</span></h2>
            <p className="text-gray-400">Manage your tasks and stay productive across all your devices.</p>
          </motion.div>

          {/* Add Task Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <form onSubmit={handleAddTask} className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700',
                  'text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                )}
              />
              <button
                type="submit"
                disabled={!newTask.trim() || loading}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950',
                  loading || !newTask.trim()
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                )}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </form>
          </motion.div>

          {/* Tasks List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Tasks ({tasks.length})</h3>
              {tasks.length > 0 && (
                <span className="text-sm text-gray-400">
                  {tasks.filter(t => t.completed).length} completed
                </span>
              )}
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="mt-4 text-gray-400">No tasks yet. Add one above to get started!</p>
              </div>
            ) : (
              <ul className="space-y-3" role="list">
                {tasks.map((task, index) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl bg-gray-900/50 border transition-all duration-200',
                      task.completed
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-gray-700 hover:border-gray-600'
                    )}
                  >
                    <button
                      onClick={() => handleToggleTask(task.id, !task.completed)}
                      className={cn(
                        'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-500 hover:border-blue-500'
                      )}
                      aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.completed && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <span className={cn(
                      'flex-1 text-left break-words transition-colors',
                      task.completed ? 'text-gray-500 line-through' : 'text-white'
                    )}>
                      {task.text}
                    </span>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="flex-shrink-0 p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                      aria-label="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Sync Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-4 rounded-xl bg-gray-900/50 border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-medium text-white">Synced across devices</p>
                <p className="text-sm text-gray-400">Your tasks are available on all signed-in devices</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}