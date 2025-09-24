'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && user && mounted) {
      // Redirect logged-in users to dashboard
      router.push('/dashboard')
    }
  }, [user, isLoading, router, mounted])

  // Show loading while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is logged in (will redirect)
  if (user) {
    return null
  }

  return <>{children}</>
}
