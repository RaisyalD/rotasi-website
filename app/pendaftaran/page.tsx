"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

export default function PendaftaranPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("type") === "panitia" ? "panitia" : "peserta"

  const [loading, setLoading] = useState(false)

  const handleSubmitPeserta = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Pendaftaran Berhasil",
        description: "Data pendaftaran Anda telah kami terima. Silakan cek email untuk informasi selanjutnya.",
      })
    }, 1500)
  }

  const handleSubmitPanitia = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Pendaftaran Panitia Berhasil",
        description: "Data pendaftaran Anda telah kami terima. Kami akan menghubungi Anda untuk proses selanjutnya.",
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
              Isi formulir di bawah ini untuk mendaftar sebagai peserta atau panitia ROTASI 2025.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="peserta">Pendaftaran Peserta</TabsTrigger>
                <TabsTrigger value="panitia">Pendaftaran Panitia</TabsTrigger>
              </TabsList>

              <TabsContent value="peserta">
                <Card>
                  <CardHeader>
                    <CardTitle>Formulir Pendaftaran Peserta ROTASI 2025</CardTitle>
                    <CardDescription>
                      Isi data diri Anda dengan lengkap dan benar. Pastikan email yang dimasukkan aktif karena akan
                      digunakan untuk komunikasi selanjutnya.
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
                          <Textarea
                            id="harapan"
                            placeholder="Ceritakan harapan Anda setelah mengikuti ROTASI"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="riwayat-organisasi">Riwayat Organisasi (Opsional)</Label>
                          <Textarea
                            id="riwayat-organisasi"
                            placeholder="Ceritakan pengalaman organisasi Anda sebelumnya"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" required />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Saya menyetujui syarat dan ketentuan ROTASI 2025
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="komitmen" required />
                          <label
                            htmlFor="komitmen"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
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
              </TabsContent>

              <TabsContent value="panitia">
                <Card>
                  <CardHeader>
                    <CardTitle>Formulir Pendaftaran Panitia ROTASI 2025</CardTitle>
                    <CardDescription>
                      Isi data diri Anda dengan lengkap dan benar. Bergabunglah menjadi bagian dari tim yang akan
                      membentuk generasi PSTI berikutnya.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitPanitia} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Data Diri</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nama-panitia">Nama Lengkap</Label>
                            <Input id="nama-panitia" placeholder="Masukkan nama lengkap" required />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nim-panitia">NIM</Label>
                            <Input id="nim-panitia" placeholder="Masukkan NIM" required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email-panitia">Email</Label>
                            <Input id="email-panitia" type="email" placeholder="Masukkan email aktif" required />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone-panitia">Nomor Telepon</Label>
                            <Input id="phone-panitia" type="tel" placeholder="Masukkan nomor telepon" required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="angkatan">Angkatan</Label>
                            <Select required>
                              <SelectTrigger id="angkatan">
                                <SelectValue placeholder="Pilih angkatan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="divisi">Pilihan Divisi</Label>
                            <Select required>
                              <SelectTrigger id="divisi">
                                <SelectValue placeholder="Pilih divisi" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="acara">Divisi Acara</SelectItem>
                                <SelectItem value="humas">Divisi Humas</SelectItem>
                                <SelectItem value="pdd">Divisi PDD</SelectItem>
                                <SelectItem value="konsumsi">Divisi Konsumsi</SelectItem>
                                <SelectItem value="perlengkapan">Divisi Perlengkapan</SelectItem>
                                <SelectItem value="keamanan">Divisi Keamanan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pengalaman & Motivasi</h3>

                        <div className="space-y-2">
                          <Label htmlFor="pengalaman">Pengalaman Organisasi</Label>
                          <Textarea id="pengalaman" placeholder="Ceritakan pengalaman organisasi Anda" required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="motivasi-panitia">Motivasi Menjadi Panitia</Label>
                          <Textarea
                            id="motivasi-panitia"
                            placeholder="Ceritakan motivasi Anda menjadi panitia ROTASI"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="alasan-divisi">Alasan Memilih Divisi</Label>
                          <Textarea
                            id="alasan-divisi"
                            placeholder="Ceritakan alasan Anda memilih divisi tersebut"
                            required
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms-panitia" required />
                          <label
                            htmlFor="terms-panitia"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Saya menyetujui syarat dan ketentuan kepanitiaan ROTASI 2025
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="komitmen-panitia" required />
                          <label
                            htmlFor="komitmen-panitia"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Saya berkomitmen untuk menjalankan tugas dan tanggung jawab sebagai panitia ROTASI 2025
                          </label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-maroon hover:bg-maroon-light" disabled={loading}>
                        {loading ? "Memproses..." : "Daftar Sebagai Panitia"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  )
}
