'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  nama_lengkap: string
  role: 'peserta' | 'mentor' | 'acara' | 'komdis'
  sektor?: number
  email?: string
  nim?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('rotasi_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rotasi_user')
  }

  useEffect(() => {
    setMounted(true)
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('rotasi_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('rotasi_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, login, logout, isLoading: true }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 