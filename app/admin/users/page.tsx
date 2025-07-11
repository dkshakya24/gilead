import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'
import { UsersManagement } from '@/components/admin/users-management'

export default async function UsersPage() {
  const session = (await auth()) as Session

  if (!session) {
    redirect('/login')
  }
  if (session.user.role !== 'admin') {
    redirect('/')
  }
  return (
    <div className="flex-1 flex flex-col space-y-4 p-8">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      </div>
      <div className="flex-1">
        <UsersManagement />
      </div>
    </div>
  )
}
