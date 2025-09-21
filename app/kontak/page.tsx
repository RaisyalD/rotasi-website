"use client"

import type React from "react"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Instagram, Youtube } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function KontakPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Pesan Terkirim",
        description: "Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.",
      })
    }, 1500)
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">KONTAK KAMI</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <p className="text-lg text-center mb-8">
              Hubungi kami untuk informasi lebih lanjut tentang ROTASI atau kirimkan pertanyaan Anda melalui formulir di
              bawah ini.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>

                <div className="space-y-6">
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">Alamat</h3>
                          <p className="text-muted-foreground">
                            Kampus UPI Purwakarta, Jl. Veteran No.8, Nagri Kaler, Kec. Purwakarta, Kabupaten Purwakarta,
                            Jawa Barat 41115
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">Telepon</h3>
                          <p className="text-muted-foreground">+62 812-9220-1859</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">Email</h3>
                          <p className="text-muted-foreground">rotasi@psti.upi.edu</p>
                          <p className="text-muted-foreground">himapsti@upi.edu</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Media Sosial</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/rotasipsti/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>@rotasipsti</span>
                    </a>
                    <a
                      href="https://www.instagram.com/himapstiupi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>@himapstiupi</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@rotasipsti"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                      <span>ROTASI PSTI</span>
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input id="nama" placeholder="Masukkan nama lengkap" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Masukkan email" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subjek">Subjek</Label>
                        <Input id="subjek" placeholder="Masukkan subjek pesan" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pesan">Pesan</Label>
                        <Textarea id="pesan" placeholder="Tulis pesan Anda di sini" className="min-h-32" required />
                      </div>

                      <Button type="submit" className="w-full bg-maroon hover:bg-maroon-light" disabled={loading}>
                        {loading ? "Mengirim..." : "Kirim Pesan"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Lokasi Kami</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15855.464624480175!2d107.42624673190394!3d-6.538581645024822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e690e68a1406c01%3A0xa66f34eb29c41198!2sIndonesia%20University%20Of%20Education%2C%20Campus%20Purwakarta!5e0!3m2!1sen!2sid!4v1751021050732!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi UPI Purwakarta"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
