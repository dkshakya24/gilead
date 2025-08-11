'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Eye, EyeOff, Plus, Trash2, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  API_URL,
  USER_LIST_MANAGEMENT_API,
  USER_MANAGEMENT_API
} from '@/lib/utils'

// Define the user interface based on your API response
interface User {
  user_id: string
  name: string
  email: string
  password: string
  role: string
  access_enabled: string
}

interface UsersResponse {
  users: User[]
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${USER_LIST_MANAGEMENT_API}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'list_users'
        })
        // headers: {
        //   'Content-Type': 'application/json'
        // }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: UsersResponse = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const togglePasswordVisibility = (userId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.user_id === userId)
      if (!user) return

      const newStatus = user.access_enabled === 'True' ? 'False' : 'True'

      const response = await fetch(`${USER_MANAGEMENT_API}`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          action: 'set_access',
          access_enabled: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      setUsers(
        users.map(user =>
          user.user_id === userId
            ? { ...user, access_enabled: newStatus }
            : user
        )
      )
      toast.success('User status updated successfully', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`${USER_MANAGEMENT_API}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'delete_user',
          user_id: userToDelete
        })
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      setUsers(users.filter(user => user.user_id !== userToDelete))
      toast.success('User deleted successfully', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    } finally {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all fields', {
        position: 'top-right',
        className: 'bottom-auto'
      })
      return
    }

    try {
      const response = await fetch(`${USER_MANAGEMENT_API}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'add_user',
          user_id: newUser.email,
          password: newUser.password,
          name: newUser.name,
          role: newUser.role,
          access_enabled: 'True',
          email: newUser.email
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add user')
      }

      // Refresh the users list after successful addition
      await fetchUsers()
      setAddDialogOpen(false)
      setNewUser({ name: '', email: '', password: '', role: 'user' })
      toast.success('User added successfully', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    } catch (error) {
      console.error('Error adding user:', error)
      toast.error('Failed to add user', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="border rounded-lg overflow-scroll">
        <div className="overflow-x-auto max-h-[450px] pb-[100px]">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="uppercase text-xs font-medium text-gray-500 px-2 sm:px-4 py-3 whitespace-nowrap">
                  Username
                </TableHead>
                <TableHead className="uppercase text-xs font-medium text-gray-500 px-2 sm:px-4 py-3 whitespace-nowrap">
                  Email
                </TableHead>
                <TableHead className="uppercase text-xs font-medium text-gray-500 px-2 sm:px-4 py-3 whitespace-nowrap">
                  Role
                </TableHead>
                <TableHead className="uppercase text-xs font-medium text-gray-500 px-2 sm:px-4 py-3 whitespace-nowrap">
                  Password
                </TableHead>
                <TableHead className="uppercase text-xs font-medium text-gray-500 px-2 sm:px-4 py-3 whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="uppercase text-xs font-medium text-gray-500 px-2 sm:px-4 py-3 whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow
                  key={user.user_id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="font-medium px-2 sm:px-4 py-3 text-sm">
                    <div className="min-w-[100px] max-w-[150px] truncate">
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-3 text-sm">
                    <div className="min-w-[120px] max-w-[180px] truncate">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize px-2 sm:px-4 py-3 text-sm whitespace-nowrap">
                    {user.role}
                  </TableCell>
                  <TableCell className="flex items-center space-x-2 px-2 sm:px-4 py-3">
                    <span className="font-mono text-sm min-w-[60px] max-w-[100px] truncate">
                      {showPassword[user.user_id]
                        ? user.password
                        : '•'.repeat(8)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(user.user_id)}
                      className="hover:bg-transparent p-1 sm:p-2 flex-shrink-0"
                    >
                      {showPassword[user.user_id] ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-3 whitespace-nowrap">
                    <Switch
                      checked={user.access_enabled === 'True'}
                      onCheckedChange={() => toggleUserStatus(user.user_id)}
                      disabled={user.email === 'admin@chryselys.com'}
                      className="data-[state=checked]:bg-rose-500"
                    />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-3 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.user_id)}
                      disabled={user.email === 'admin@chryselys.com'}
                      className="hover:bg-transparent p-1 sm:p-2"
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-500 hover:bg-rose-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={e =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={newUser.password}
                onChange={e =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-rose-500 hover:bg-rose-600"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
