'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, GraduationCap, Calendar, Shield, LogOut, User, Mail, Hash } from 'lucide-react'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'
import { LogoutConfirmDialog } from '@/components/LogoutConfirmDialog'

export default function AdminDashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!isLoading && !user && !isLoggingOut) {
      router.push('/auth/login-admin')
    } else if (!isLoading && user && user.role !== 'admin') {
      // Redirect non-admin users to their appropriate login page
      if (user.role === 'mentor') {
        router.push('/auth/login-mentor')
      } else if (user.role === 'acara') {
        router.push('/auth/login-acara')
      } else {
        router.push('/auth/login')
      }
    }
  }, [user, isLoading, router, isLoggingOut])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // ignore
    }
    
    logout()
    window.location.href = '/auth/login-admin'
  }

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard ROTASI</h1>
            <p className="text-muted-foreground">Panel administrasi sistem ROTASI</p>
          </div>
          <Button onClick={handleLogoutClick} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Shield className="h-6 w-6" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  {user.nama_lengkap}
                  <Badge className="bg-purple-100 text-purple-800">
                    Admin
                  </Badge>
                </CardTitle>
                <CardDescription>
                  ID: {user.id}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin Dashboard Content */}
        <AdminDashboard />

        {/* Logout Confirmation Dialog */}
        <LogoutConfirmDialog
          isOpen={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          onConfirm={handleLogout}
          userName={user?.nama_lengkap}
          userRole={user?.role}
        />
      </div>
    </div>
  )
}
