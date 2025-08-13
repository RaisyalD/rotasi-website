'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { Users, GraduationCap, Calendar, Shield } from 'lucide-react'

interface Sector {
  sector_number: number
  sector_name: string
}

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [userType, setUserType] = useState<'peserta' | 'mentor' | 'acara' | 'komdis'>('peserta')
  const [sectors, setSectors] = useState<Sector[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    sektor: '',
    sectorPassword: '',
    loginPassword: ''
  })

  useEffect(() => {
    fetchSectors()
  }, [])

  const fetchSectors = async () => {
    try {
      const response = await fetch('/api/sectors')
      const data = await response.json()
      if (data.success) {
        setSectors(data.sectors)
      }
    } catch (error) {
      console.error('Error fetching sectors:', error)
      // Fallback data jika API error
      setSectors([
        { sector_number: 1, sector_name: 'Sektor 1' },
        { sector_number: 2, sector_name: 'Sektor 2' },
        { sector_number: 3, sector_name: 'Sektor 3' },
        { sector_number: 4, sector_name: 'Sektor 4' },
        { sector_number: 5, sector_name: 'Sektor 5' },
        { sector_number: 6, sector_name: 'Sektor 6' },
        { sector_number: 7, sector_name: 'Sektor 7' },
        { sector_number: 8, sector_name: 'Sektor 8' },
        { sector_number: 9, sector_name: 'Sektor 9' },
        { sector_number: 10, sector_name: 'Sektor 10' }
      ])
    }
  }

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
        userType,
        nama_lengkap: formData.nama_lengkap,
        ...(userType === 'peserta' && {
          sektor: parseInt(formData.sektor),
          sectorPassword: formData.sectorPassword
        }),
        ...(userType === 'mentor' && {
          sektor: parseInt(formData.sektor),
          sectorPassword: formData.sectorPassword
        }),
        ...((userType === 'acara' || userType === 'komdis') && {
          loginPassword: formData.loginPassword
        })
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
        router.push('/dashboard')
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  const renderPesertaForm = () => (
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
        <Label htmlFor="sektor">Pilih Sektor</Label>
        <Select value={formData.sektor} onValueChange={(value) => handleInputChange('sektor', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih sektor" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector.sector_number} value={sector.sector_number.toString()}>
                {sector.sector_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="sectorPassword">Password Sektor</Label>
        <Input
          id="sectorPassword"
          type="password"
          value={formData.sectorPassword}
          onChange={(e) => handleInputChange('sectorPassword', e.target.value)}
          placeholder="Masukkan password sektor"
          required
        />
      </div>
    </div>
  )

  const renderMentorForm = () => (
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
        <Label htmlFor="sektor">Pilih Sektor</Label>
        <Select value={formData.sektor} onValueChange={(value) => handleInputChange('sektor', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih sektor" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector.sector_number} value={sector.sector_number.toString()}>
                {sector.sector_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="sectorPassword">Password Sektor</Label>
        <Input
          id="sectorPassword"
          type="password"
          value={formData.sectorPassword}
          onChange={(e) => handleInputChange('sectorPassword', e.target.value)}
          placeholder="Masukkan password sektor"
          required
        />
      </div>
    </div>
  )

  const renderDivisiForm = () => (
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
  )

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login ROTASI</CardTitle>
            <CardDescription>
              Pilih tipe user dan masukkan data untuk login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="peserta" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Peserta
                </TabsTrigger>
                <TabsTrigger value="mentor" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Mentor
                </TabsTrigger>
                <TabsTrigger value="acara" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Acara
                </TabsTrigger>
                <TabsTrigger value="komdis" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Komdis
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="mt-6">
                <TabsContent value="peserta">
                  {renderPesertaForm()}
                </TabsContent>
                <TabsContent value="mentor">
                  {renderMentorForm()}
                </TabsContent>
                <TabsContent value="acara">
                  {renderDivisiForm()}
                </TabsContent>
                <TabsContent value="komdis">
                  {renderDivisiForm()}
                </TabsContent>

                {error && (
                  <Alert className="mt-4" variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? 'Login...' : 'Login'}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 