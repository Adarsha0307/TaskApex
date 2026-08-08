import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="fixed inset-0 bg-white" style={{ height: '100dvh' }}>
      <iframe
        src="/taskmanager.html"
        title="TaskAPex"
        className="h-full w-full border-0"
        allow="autoplay; notifications"
        sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
      />
    </div>
  )
}