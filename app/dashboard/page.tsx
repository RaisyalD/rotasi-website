'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, GraduationCap, Calendar, Shield, LogOut, User, Mail, Hash } from 'lucide-react'
import { PesertaDashboard } from '@/components/dashboard/PesertaDashboard'
import { MentorDashboard } from '@/components/dashboard/MentorDashboard'
import { AcaraDashboard } from '@/components/dashboard/AcaraDashboard'

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // ignore
    }
    logout()
    router.push('/')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'peserta':
        return <Users className="h-6 w-6" />
      case 'mentor':
        return <GraduationCap className="h-6 w-6" />
      case 'acara':
        return <Calendar className="h-6 w-6" />
      case 'komdis':
        return <User className="h-6 w-6" />
      default:
        return <User className="h-6 w-6" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'peserta':
        return 'bg-blue-100 text-blue-800'
      case 'mentor':
        return 'bg-green-100 text-green-800'
      case 'acara':
        return 'bg-orange-100 text-orange-800'
      case 'komdis':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'peserta':
        return 'Peserta ROTASI'
      case 'mentor':
        return 'Mentor Sektor'
      case 'acara':
        return 'Divisi Acara'
      case 'komdis':
        return 'User'
      default:
        return role
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard ROTASI</h1>
            <p className="text-muted-foreground">Selamat datang di platform ROTASI</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              {getRoleIcon(user.role)}
              <div>
                <CardTitle className="flex items-center gap-2">
                  {user.nama_lengkap}
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleLabel(user.role)}
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
              {user.nim && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>NIM: {user.nim}</span>
                </div>
              )}
              {user.sektor && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Sektor {user.sektor}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role-specific Content */}
        {user.role === 'peserta' && <PesertaDashboard user={user as any} />}

        {user.role === 'mentor' && <MentorDashboard user={user as any} />}

        {/* Komdis dashboard removed */}

        {user.role === 'acara' && <AcaraDashboard />}
      </div>
    </div>
  )
} 