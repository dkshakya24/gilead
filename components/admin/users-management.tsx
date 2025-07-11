'use client'

import { useState } from 'react'
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
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
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

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@chryselys.com',
    password: 'admin123',
    isEnabled: true
  },
  {
    id: 2,
    name: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    isEnabled: true
  },
  {
    id: 3,
    name: 'user2',
    email: 'user2@example.com',
    password: 'password456',
    isEnabled: false
  }
]

export function UsersManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' })

  const togglePasswordVisibility = (userId: number) => {
    setShowPassword(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map(user =>
        user.id === userId ? { ...user, isEnabled: !user.isEnabled } : user
      )
    )
  }

  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete))
      toast.success('User deleted successfully')
    }
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all fields')
      return
    }

    const newId = Math.max(...users.map(u => u.id)) + 1
    setUsers([...users, { ...newUser, id: newId, isEnabled: true }])
    setAddDialogOpen(false)
    setNewUser({ name: '', email: '', password: '' })
    toast.success('User added successfully')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        {/* <h1 className="text-2xl font-semibold">User Management</h1> */}
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="uppercase text-xs font-medium text-gray-500">
                Username
              </TableHead>
              <TableHead className="uppercase text-xs font-medium text-gray-500">
                Email
              </TableHead>
              <TableHead className="uppercase text-xs font-medium text-gray-500">
                Password
              </TableHead>
              <TableHead className="uppercase text-xs font-medium text-gray-500">
                Status
              </TableHead>
              <TableHead className="uppercase text-xs font-medium text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} className="border-b border-gray-100">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="flex items-center space-x-2">
                  <span className="font-mono">
                    {showPassword[user.id] ? user.password : '•'.repeat(8)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility(user.id)}
                    className="hover:bg-transparent"
                  >
                    {showPassword[user.id] ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.isEnabled}
                    onCheckedChange={() => toggleUserStatus(user.id)}
                    disabled={user.email === 'admin@chryselys.com'}
                    className="data-[state=checked]:bg-rose-500"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.email === 'admin@chryselys.com'}
                    className="hover:bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
