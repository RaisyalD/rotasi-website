'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield } from 'lucide-react'

export function AdminRegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    loginPassword: '',
    divisionPassword: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        userType: 'admin',
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        loginPassword: formData.loginPassword,
        divisionPassword: formData.divisionPassword
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Registrasi admin berhasil! Silakan login untuk melanjutkan.')
        setTimeout(() => {
          router.push('/auth/login-admin')
        }, 2000)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Terjadi kesalahan saat registrasi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Daftar Admin ROTASI
            </CardTitle>
            <CardDescription>
              Lengkapi data untuk mendaftar sebagai admin sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                  <Input
                    id="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={(e) => handleInputChange('nama_lengkap', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Masukkan email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loginPassword">Password Login</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={formData.loginPassword}
                    onChange={(e) => handleInputChange('loginPassword', e.target.value)}
                    placeholder="Buat password untuk login"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="divisionPassword">Password Divisi Admin</Label>
                  <Input
                    id="divisionPassword"
                    type="password"
                    value={formData.divisionPassword}
                    onChange={(e) => handleInputChange('divisionPassword', e.target.value)}
                    placeholder="Masukkan password divisi admin"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="mt-4" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun admin?{' '}
                <a 
                  href="/auth/login-admin" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Login di sini
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
