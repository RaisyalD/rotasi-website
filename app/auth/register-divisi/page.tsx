"use client"
import type React from "react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
const ANGKATAN = ["2022", "2023", "2024"]

export default function RegisterDivisiPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nama: "",
    nim: "",
    email: "",
    angkatan: "",
    divisi: "",
    motivasi: "",
    pengalaman: "",
    syarat: false,
  })
  const [error, setError] = useState<{ [k: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const { name, value, type } = target
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (target as HTMLInputElement).checked }))
      setError((prev) => ({ ...prev, [name]: "" }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSelect = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let err: { [k: string]: string } = {}
    if (!form.nama) err.nama = "Nama wajib diisi"
    if (!form.nim) err.nim = "NIM wajib diisi"
    if (!form.email) err.email = "Email wajib diisi"
    if (!form.angkatan) err.angkatan = "Angkatan wajib dipilih"
    if (!form.divisi) err.divisi = "Divisi wajib dipilih"
    if (!form.motivasi) err.motivasi = "Motivasi wajib diisi"
    if (!form.pengalaman) err.pengalaman = "Pengalaman organisasi wajib diisi"
    if (!form.syarat) err.syarat = "Harus menyetujui syarat & ketentuan"
    setError(err)
    if (Object.keys(err).length > 0) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Registrasi Berhasil",
        description: "Data registrasi Anda telah kami terima. Silakan cek email untuk informasi selanjutnya.",
      })
    }, 1500)
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">REGISTRASI DIVISI PANITIA ROTASI 2025</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-center mb-8">
              Isi formulir di bawah ini untuk mendaftar sebagai panitia divisi ROTASI 2025.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Formulir Registrasi Divisi Panitia ROTASI 2025</CardTitle>
                <CardDescription>
                  Isi data diri Anda dengan lengkap dan benar. Pastikan email yang dimasukkan aktif karena akan digunakan untuk komunikasi selanjutnya.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Diri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input id="nama" name="nama" placeholder="Masukkan nama lengkap" value={form.nama} onChange={handleChange} required />
                        {error.nama && <p className="text-xs text-red-500 mt-1">{error.nama}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nim">NIM</Label>
                        <Input id="nim" name="nim" placeholder="Masukkan NIM" value={form.nim} onChange={handleChange} required />
                        {error.nim && <p className="text-xs text-red-500 mt-1">{error.nim}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Masukkan email aktif" value={form.email} onChange={handleChange} required />
                        {error.email && <p className="text-xs text-red-500 mt-1">{error.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="angkatan">Angkatan</Label>
                        <Select value={form.angkatan} onValueChange={(v) => handleSelect("angkatan", v)}>
                          <SelectTrigger id="angkatan">
                            <SelectValue placeholder="Pilih angkatan" />
                          </SelectTrigger>
                          <SelectContent>
                            {ANGKATAN.map((a) => (
                              <SelectItem key={a} value={a}>{a}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {error.angkatan && <p className="text-xs text-red-500 mt-1">{error.angkatan}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="divisi">Pilihan Divisi</Label>
                      <Select value={form.divisi} onValueChange={(v) => handleSelect("divisi", v)}>
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
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Motivasi & Pengalaman</h3>
                    <div className="space-y-2">
                      <Label htmlFor="motivasi">Motivasi Menjadi Panitia</Label>
                      <Textarea id="motivasi" name="motivasi" placeholder="Ceritakan motivasi Anda menjadi panitia" value={form.motivasi} onChange={handleChange} required />
                      {error.motivasi && <p className="text-xs text-red-500 mt-1">{error.motivasi}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pengalaman">Pengalaman Organisasi</Label>
                      <Textarea id="pengalaman" name="pengalaman" placeholder="Ceritakan pengalaman organisasi Anda" value={form.pengalaman} onChange={handleChange} required />
                      {error.pengalaman && <p className="text-xs text-red-500 mt-1">{error.pengalaman}</p>}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="syarat"
                        name="syarat"
                        checked={form.syarat}
                        onCheckedChange={(checked) =>
                          handleChange({
                            target: {
                              name: "syarat",
                              value: checked === true,
                              type: "checkbox",
                              checked: checked === true,
                            }
                          } as unknown as React.ChangeEvent<HTMLInputElement>)
                        }
                      />
                      <label htmlFor="syarat" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Saya menyetujui syarat dan ketentuan kepanitiaan ROTASI 2025
                      </label>
                    </div>
                    {error.syarat && <p className="text-xs text-red-500 mt-1">{error.syarat}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-maroon hover:bg-maroon-light" disabled={loading}>
                    {loading ? "Memproses..." : "Register"}
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