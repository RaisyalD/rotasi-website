"use client"
import type React from "react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPesertaPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmitPeserta = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Pendaftaran Berhasil",
        description: "Data pendaftaran Anda telah kami terima. Silakan cek email untuk informasi selanjutnya.",
      })
    }, 1500)
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">PENDAFTARAN ROTASI</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />
            <p className="text-lg text-center mb-8">
              Isi formulir di bawah ini untuk mendaftar sebagai peserta ROTASI 2025.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Formulir Pendaftaran Peserta ROTASI 2025</CardTitle>
                <CardDescription>
                  Isi data diri Anda dengan lengkap dan benar. Pastikan email yang dimasukkan aktif karena akan digunakan untuk komunikasi selanjutnya.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPeserta} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Diri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input id="nama" placeholder="Masukkan nama lengkap" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nim">NIM</Label>
                        <Input id="nim" placeholder="Masukkan NIM" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Masukkan email aktif" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input id="phone" type="tel" placeholder="Masukkan nomor telepon" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alamat">Alamat</Label>
                      <Textarea id="alamat" placeholder="Masukkan alamat lengkap" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Jenis Kelamin</Label>
                      <RadioGroup defaultValue="laki-laki">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="laki-laki" id="laki-laki" />
                          <Label htmlFor="laki-laki">Laki-laki</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="perempuan" id="perempuan" />
                          <Label htmlFor="perempuan">Perempuan</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informasi Tambahan</h3>
                    <div className="space-y-2">
                      <Label htmlFor="motivasi">Motivasi Mengikuti ROTASI</Label>
                      <Textarea id="motivasi" placeholder="Ceritakan motivasi Anda mengikuti ROTASI" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="harapan">Harapan Setelah Mengikuti ROTASI</Label>
                      <Textarea id="harapan" placeholder="Ceritakan harapan Anda setelah mengikuti ROTASI" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="riwayat-organisasi">Riwayat Organisasi (Opsional)</Label>
                      <Textarea id="riwayat-organisasi" placeholder="Ceritakan pengalaman organisasi Anda sebelumnya" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Saya menyetujui syarat dan ketentuan ROTASI 2025
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="komitmen" required />
                      <label htmlFor="komitmen" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Saya berkomitmen untuk mengikuti seluruh rangkaian kegiatan ROTASI 2025
                      </label>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-maroon hover:bg-maroon-light" disabled={loading}>
                    {loading ? "Memproses..." : "Daftar Sekarang"}
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