import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Calendar, Users, Award, BookOpen } from "lucide-react"
import CountdownTimer from "@/components/countdown-timer"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-50"
        >
          <source src="/logo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/rotasi logo.png"
                alt="ROTASI Logo"
                width={150}
                height={150}
                className="h-32 w-auto animate-fade-in"
              />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-up">
              REGENERASI DAN ORIENTASI MAHASISWA PSTI
            </h1>
            <p
              className="text-xl md:text-2xl text-foreground/80 mb-8 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              Membentuk Karakter, Melanjutkan Perjuangan PSTI
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
              style={{ animationDelay: "400ms" }}
            >
              <Button asChild size="lg" className="bg-maroon hover:bg-maroon-light">
                <Link href="/auth/register-divisi">Daftar Sekarang</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/tentang">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">MENUJU ROTASI SEPTEMBER 2025</h2>
            <CountdownTimer targetDate="2025-09-01T00:00:00" />
            <p className="mt-8 text-muted-foreground">
              Persiapkan dirimu untuk menjadi bagian dari regenerasi PSTI UPI
            </p>
          </div>
        </div>
      </section>

      {/* About Section Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">TENTANG ROTASI</h2>
              <Separator className="w-24 h-1 bg-primary mb-6" />
              <p className="text-muted-foreground mb-6">
                ROTASI adalah program kaderisasi yang bertujuan untuk membentuk karakter mahasiswa PSTI UPI yang loyal,
                progresif, kritis, dan memiliki solidaritas tinggi. Melalui berbagai kegiatan dan tahapan, ROTASI
                mempersiapkan mahasiswa baru untuk menjadi bagian dari keluarga besar PSTI UPI.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Inisiatif</h3>
                    <p className="text-sm text-muted-foreground">
                    Mahasiswa PSTI diharapkan mampu memulai perubahan positif di lingkungan sekitarnya.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Tangguh</h3>
                    <p className="text-sm text-muted-foreground">
                      Mahasiswa PSTI dilatih untuk tetap tegar dan beradaptasi dalam berbagai situasi.
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild className="mt-8 bg-maroon hover:bg-maroon-light">
                <Link href="/tentang">
                  Selengkapnya <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10"></div>
              <Image
                src="./rotasii2024.jpg"
                alt="Kegiatan ROTASI 2024"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Preview */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ALUR & TAHAPAN KEGIATAN</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ROTASI terdiri dari beberapa tahapan yang dirancang untuk membangun karakter dan pengetahuan mahasiswa
              baru PSTI UPI
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="timeline-container">
              {[
                { title: "Pra-ROTASI", date: "Agustus 2025", desc: "Persiapan dan pengenalan awal" },
                {
                  title: "ROTASI Tahap I",
                  date: "September 2025",
                  desc: "Pengenalan lingkungan kampus dan program studi",
                },
                {
                  title: "ROTASI Tahap II",
                  date: "September 2025",
                  desc: "Pembentukan karakter dan nilai-nilai dasar",
                },
              ].map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-content w-full md:w-5/12">
                    <h3 className="font-bold text-xl">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-primary mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{item.date}</span>
                    </div>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-maroon hover:bg-maroon-light">
              <Link href="/tahapan">
                Lihat Timeline Lengkap <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FITUR WEBSITE ROTASI</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform digital yang mendukung seluruh kegiatan kaderisasi ROTASI
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Calendar className="h-10 w-10 text-primary" />,
                title: "Informasi Kegiatan",
                desc: "Jadwal lengkap dan detail setiap tahapan ROTASI",
              },
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Pendaftaran Online",
                desc: "Sistem pendaftaran peserta dan panitia yang terintegrasi",
              },
              {
                icon: <BookOpen className="h-10 w-10 text-primary" />,
                title: "Manajemen Tugas",
                desc: "Upload dan evaluasi tugas kaderisasi secara digital",
              },
              {
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "Sertifikat Digital",
                desc: "Sertifikat kelulusan yang dapat diunduh secara otomatis",
              },
              {
                icon: (
                  <Image
                    src="./rotasi logo.png"
                    alt="ROTASI Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                ),
                title: "Nilai-nilai ROTASI",
                desc: "Pengenalan filosofi dan nilai-nilai dasar kaderisasi",
              },
              {
                icon: (
                  <Image
                    src="HIMA-PSTI.svg"
                    alt="HIMA PSTI Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                ),
                title: "Profil HIMA PSTI",
                desc: "Informasi tentang Himpunan Mahasiswa PSTI UPI",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-maroon">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">BERGABUNGLAH DENGAN ROTASI</h2>
            <p className="text-white/80 mb-8">
              Jadilah bagian dari regenerasi PSTI UPI dan kembangkan potensimu bersama kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default" className="bg-white text-maroon hover:bg-white/90">
                <Link href="https://www.instagram.com/rotasipsti/">Ikuti Instagram Kami</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link href="/auth/register-divisi">Gabung Sebagai Peserta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
