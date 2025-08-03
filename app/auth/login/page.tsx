"use client"
import type React from "react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

const DIVISI = [
  { value: "acara", label: "Divisi Acara" },
  { value: "mentor", label: "Divisi Mentor" },
  { value: "komdis", label: "Divisi Komdis" },
  { value: "bendahara", label: "Divisi Bendahara" },
  { value: "kreatif", label: "Divisi Kreatif" },
  { value: "konsumsi", label: "Divisi Konsumsi" },
  { value: "inventaris", label: "Divisi Inventaris" },
  { value: "relasi", label: "Divisi Relasi" },
  { value: "pendanaan", label: "Divisi Pendanaan" },
  { value: "medis", label: "Divisi Medis" },
]

export default function LoginDivisiPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: "",
    divisi: "",
  })
  const [error, setError] = useState<{ [k: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSelect = (value: string) => {
    setForm((prev) => ({ ...prev, divisi: value }))
    setError((prev) => ({ ...prev, divisi: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let err: { [k: string]: string } = {}
    if (!form.email) err.email = "Email wajib diisi"
    if (!form.password) err.password = "Password wajib diisi"
    if (!form.divisi) err.divisi = "Divisi wajib dipilih"
    setError(err)
    if (Object.keys(err).length > 0) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Login Berhasil",
        description: "Anda berhasil login sebagai panitia divisi.",
      })
    }, 1200)
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">LOGIN DIVISI PANITIA ROTASI 2025</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-center mb-8">
              Masuk sebagai panitia divisi ROTASI 2025.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Login Divisi Panitia ROTASI 2025</CardTitle>
                <CardDescription>
                  Masukkan email, password, dan pilih divisi Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="Masukkan email" value={form.email} onChange={handleChange} required />
                      {error.email && <p className="text-xs text-red-500 mt-1">{error.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" placeholder="Masukkan password" value={form.password} onChange={handleChange} required />
                      {error.password && <p className="text-xs text-red-500 mt-1">{error.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="divisi">Pilih Divisi</Label>
                      <Select value={form.divisi} onValueChange={handleSelect}>
                        <SelectTrigger id="divisi">
                          <SelectValue placeholder="Pilih divisi" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIVISI.map((d) => (
                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {error.divisi && <p className="text-xs text-red-500 mt-1">{error.divisi}</p>}
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-maroon hover:bg-maroon-light" disabled={loading}>
                    {loading ? "Memproses..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
} 