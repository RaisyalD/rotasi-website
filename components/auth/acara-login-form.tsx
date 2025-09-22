'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Calendar } from 'lucide-react'

export function AcaraLoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    loginPassword: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const payload = {
        userType: 'acara',
        email: formData.email,
        loginPassword: formData.loginPassword
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        login(data.user)
        
        // Random motivational messages
        const motivationalMessages = [
          "Tetap semangat jalani harimu!",
          "Jangan lupa makan dan minum ya untuk penuhi energimu!",
          "Tetaplah senyum meskipun tidak bahagia.",
          "Jangan lupa untuk jaga kesehatan ya!"
        ]
        
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
        
        // Show welcome notification
        toast({
          title: `Selamat datang ${data.user.nama_lengkap}!`,
          description: randomMessage,
          duration: 5000,
        })
        
        // Redirect after showing notification
        setTimeout(() => {
          router.push('/dashboard')
        }, 5000)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login')
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
              <Calendar className="h-6 w-6" />
              Login Divisi Acara ROTASI
            </CardTitle>
            <CardDescription>
              Masukkan data untuk login sebagai divisi acara
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="space-y-4">
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
                    placeholder="Masukkan password login"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="mt-4" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? 'Login...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
