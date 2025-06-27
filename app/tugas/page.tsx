"use client"

import type React from "react"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function TugasPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Tugas Berhasil Dikirim",
        description: "Tugas Anda telah berhasil dikirim dan akan segera dievaluasi oleh panitia.",
      })
    }, 1500)
  }

  const tugasData = [
    {
      id: "tugas-1",
      title: "Esai Pengenalan Diri",
      description: "Tulis esai tentang diri Anda, latar belakang, minat, dan harapan selama kuliah di PSTI UPI.",
      deadline: "15 Agustus 2025",
      status: "open",
    },
    {
      id: "tugas-2",
      title: "Analisis Artikel Pendidikan",
      description:
        "Pilih satu artikel tentang pendidikan dan teknologi, lalu buat analisis singkat tentang artikel tersebut.",
      deadline: "22 Agustus 2025",
      status: "open",
    },
    {
      id: "tugas-3",
      title: "Presentasi Diri",
      description:
        "Buat video presentasi diri dengan durasi 3-5 menit yang menjelaskan motivasi dan tujuan Anda kuliah di PSTI UPI.",
      deadline: "29 Agustus 2025",
      status: "upcoming",
    },
    {
      id: "tugas-4",
      title: "Proposal Kegiatan",
      description: "Buat proposal kegiatan sederhana yang berkaitan dengan pengembangan program studi PSTI UPI.",
      deadline: "5 September 2025",
      status: "upcoming",
    },
    {
      id: "tugas-5",
      title: "Refleksi ROTASI",
      description: "Tulis refleksi tentang pengalaman Anda selama mengikuti rangkaian kegiatan ROTASI.",
      deadline: "12 September 2025",
      status: "upcoming",
    },
  ]

  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">TUGAS DAN EVALUASI</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <p className="text-lg text-center mb-8">
              Kumpulkan tugas-tugas ROTASI dan lihat hasil evaluasi Anda di sini.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="daftar-tugas" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="daftar-tugas">Daftar Tugas</TabsTrigger>
                <TabsTrigger value="upload-tugas">Upload Tugas</TabsTrigger>
                <TabsTrigger value="hasil-evaluasi">Hasil Evaluasi</TabsTrigger>
              </TabsList>

              <TabsContent value="daftar-tugas">
                <div className="space-y-6">
                  {tugasData.map((tugas) => (
                    <Card
                      key={tugas.id}
                      className={`border-border/50 ${tugas.status === "upcoming" ? "opacity-70" : ""}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <h3 className="text-xl font-bold">{tugas.title}</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">{tugas.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Deadline: {tugas.deadline}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {tugas.status === "open" ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Dibuka</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">Akan Datang</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upload-tugas">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Tugas ROTASI</CardTitle>
                    <CardDescription>
                      Pilih tugas yang ingin Anda kumpulkan dan unggah file tugas Anda di sini.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="tugas">Pilih Tugas</Label>
                        <select
                          id="tugas"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="">Pilih tugas yang akan dikumpulkan</option>
                          {tugasData
                            .filter((tugas) => tugas.status === "open")
                            .map((tugas) => (
                              <option key={tugas.id} value={tugas.id}>
                                {tugas.title}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="file">File Tugas</Label>
                        <div className="grid w-full gap-1.5">
                          <Label
                            htmlFor="file"
                            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-background px-3 py-2 text-center hover:bg-accent/50"
                          >
                            <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                            <div className="text-sm text-muted-foreground">
                              Klik untuk memilih file atau drag & drop file di sini
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">PDF, DOCX, atau ZIP (Maks. 10MB)</div>
                          </Label>
                          <Input id="file" type="file" className="hidden" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                        <Textarea
                          id="keterangan"
                          placeholder="Tambahkan keterangan atau catatan tentang tugas Anda"
                          className="min-h-32"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span>Pastikan file yang Anda upload sesuai dengan ketentuan tugas.</span>
                      </div>

                      <Button type="submit" className="w-full bg-maroon hover:bg-maroon-light" disabled={loading}>
                        {loading ? "Mengunggah..." : "Upload Tugas"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hasil-evaluasi">
                <Card>
                  <CardHeader>
                    <CardTitle>Hasil Evaluasi Tugas</CardTitle>
                    <CardDescription>
                      Lihat hasil evaluasi dan feedback dari panitia untuk tugas-tugas yang telah Anda kumpulkan.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-bold mb-2">Belum Ada Hasil Evaluasi</h3>
                      <p className="text-muted-foreground max-w-md">
                        Hasil evaluasi akan muncul di sini setelah panitia menilai tugas yang Anda kumpulkan. Silakan
                        cek kembali nanti.
                      </p>
                    </div>
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
