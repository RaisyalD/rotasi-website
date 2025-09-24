import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Lightbulb, Heart } from "lucide-react"

export default function TentangPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">TENTANG ROTASI</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
              <div className="md:w-1/3 flex justify-center">
                <Image
                  src="/rotasi logo.png"
                  alt="ROTASI Logo"
                  width={200}
                  height={200}
                  className="h-48 w-auto"
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-lg mb-4">
                  ROTASI (Regenerasi dan Orientasi Mahasiswa PSTI) adalah program kaderisasi yang diselenggarakan oleh
                  Departemen Pengembangan Sumber Daya Organisasi (PSDO) Himpunan Mahasiswa Pendidikan Sistem dan Teknologi Informasi (HIMA PSTI) Universitas Pendidikan
                  Indonesia.
                </p>
                <p className="text-muted-foreground">
                  Program ini dirancang untuk memperkenalkan mahasiswa baru dengan lingkungan kampus, program studi, dan
                  nilai-nilai yang dijunjung tinggi oleh PSTI UPI. ROTASI bertujuan untuk membentuk karakter mahasiswa
                  yang loyal, progresif, tangguh, dan memiliki solidaritas tinggi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">SEJARAH DAN FILOSOFI</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <div className="prose prose-invert max-w-none">
              <p>
                Dari awal tahun Prodi PSTI berdiri yaitu tahun 2018, Awal mula nama kaderisasi ini adalah Masa Pengenalan Prodi PSTI (MANPRO PSTI) dan diubah menjadi ROTASI pada tahun 2023.
                ROTASI (Regenerasi dan Orientasi Mahasiswa PSTI) adalah program kaderisasi yang diselenggarakan untuk
                mahasiswa baru prodi PSTI UPI. Program ini dirancang untuk memperkenalkan mahasiswa baru dengan
                lingkungan kampus, program studi, dan nilai-nilai yang dijunjung tinggi oleh PSTI UPI.
              </p>

              <p>
                Nama "ROTASI" dipilih sebagai simbol perputaran dan regenerasi yang berkelanjutan. Seperti bumi yang
                berotasi pada porosnya, mahasiswa PSTI diharapkan dapat terus bergerak maju dengan tetap berpegang pada
                nilai-nilai inti yang menjadi landasan program studi.
              </p>

              <p>
                Filosofi ROTASI didasarkan pada prinsip keberlanjutan dan pengembangan. Setiap angkatan mahasiswa baru
                dipersiapkan untuk menjadi penerus yang akan membawa program studi ke arah yang lebih baik, sambil tetap
                menghormati tradisi dan nilai-nilai yang telah dibangun oleh generasi sebelumnya.
              </p>

              <p>
                Setiap tahun, ROTASI mengangkat tema yang berbeda namun tetap berlandaskan pada nilai-nilai inti PSTI.
                Tema-tema ini dirancang untuk merespons perkembangan teknologi dan pendidikan, serta tantangan yang
                dihadapi oleh mahasiswa di era digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">NILAI-NILAI DASAR</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Inisiatif</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Kemampuan untuk proaktif, berani mengambil tindakan, dan mencari solusi tanpa menunggu perintah. Mahasiswa PSTI diharapkan mampu memulai perubahan positif di lingkungan sekitarnya.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Tangguh</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Ketahanan mental dan fisik dalam menghadapi tantangan, serta tidak mudah menyerah. Mahasiswa PSTI dilatih untuk tetap tegar dan beradaptasi dalam berbagai situasi.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Beretika</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Menjunjung tinggi nilai moral, sopan santun, dan integritas dalam setiap tindakan. Mahasiswa PSTI diharapkan mampu bersikap jujur, adil, dan bertanggung jawab.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Inovatif</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Kreatif dalam berpikir dan berani mencoba hal baru untuk menciptakan perubahan yang lebih baik. Mahasiswa PSTI didorong untuk selalu mencari ide-ide segar dan solusi inovatif.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Kooperatif</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Mampu bekerja sama, menghargai pendapat, dan membangun kolaborasi yang harmonis dengan sesama mahasiswa maupun pihak lain untuk mencapai tujuan bersama.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">TUJUAN KADERISASI</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Pengenalan Lingkungan</h3>
                  <p className="text-muted-foreground">
                    Memperkenalkan mahasiswa baru dengan lingkungan kampus, fasilitas, dan sumber daya yang tersedia di
                    UPI dan program studi PSTI.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Pembentukan Karakter</h3>
                  <p className="text-muted-foreground">
                    Membentuk karakter mahasiswa yang sesuai dengan nilai-nilai PSTI, termasuk loyalitas, progresivitas,
                    tangguh, dan solidaritas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Pengembangan Keterampilan</h3>
                  <p className="text-muted-foreground">
                    Mengembangkan keterampilan akademik dan non-akademik yang dibutuhkan untuk sukses dalam program
                    studi dan karir di masa depan.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Membangun Jaringan</h3>
                  <p className="text-muted-foreground">
                    Memfasilitasi pembentukan jaringan dan hubungan antara mahasiswa baru, senior, alumni, dan dosen
                    PSTI.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Menjaga Tradisi</h3>
                  <p className="text-muted-foreground">
                    Melestarikan dan mengembangkan tradisi PSTI yang telah dibangun selama bertahun-tahun, sambil tetap
                    beradaptasi dengan perkembangan zaman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hima-psti" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">HIMA PSTI UPI</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 flex justify-center">
                <Image
                  src="HIMA-PSTI.svg"
                  alt="HIMA PSTI Logo"
                  width={200}
                  height={200}
                  className="h-48 w-auto"
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-lg mb-4">
                  Himpunan Mahasiswa Pendidikan Sistem dan Teknologi Informasi (HIMA PSTI) UPI adalah organisasi
                  mahasiswa yang mewadahi aspirasi dan kegiatan mahasiswa PSTI UPI.
                </p>
                <p className="text-muted-foreground mb-4">
                  HIMA PSTI UPI berperan sebagai pengampu kegiatan ROTASI dan bertanggung jawab atas keberlangsungan
                  program kaderisasi ini dari tahun ke tahun. Melalui ROTASI, HIMA PSTI UPI berupaya untuk membentuk
                  karakter mahasiswa PSTI yang sesuai dengan nilai-nilai dan visi misi program studi.
                </p>
                <p className="text-muted-foreground">
                  Seluruh rangkaian kegiatan ROTASI berada di bawah pengawasan dan bimbingan HIMA PSTI UPI, dengan
                  dukungan dari dosen dan pimpinan program studi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
