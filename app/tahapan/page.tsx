import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, FileText } from "lucide-react"

export default function TahapanPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">ALUR & TAHAPAN KEGIATAN</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <p className="text-lg text-center mb-8">
              ROTASI terdiri dari beberapa tahapan yang dirancang untuk membangun karakter dan pengetahuan mahasiswa
              baru PSTI UPI secara bertahap dan komprehensif.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="timeline-container">
              {[
                {
                  title: "Pra-ROTASI",
                  date: "Agustus 2025",
                  location: "Online & Kampus UPI Purwakarta",
                  duration: "1 minggu",
                  desc: "Tahap persiapan dan technical meeting sebelum kegiatan ROTASI dimulai.",
                  activities: [
                    "Sosialisasi ROTASI melalui media sosial",
                    "Pendaftaran online peserta",
                    "Pembagian kelompok",
                    "Technical meeting",
                    "Pengenalan panitia dan pembimbing",
                  ],
                },
                {
                  title: "ROTASI Tahap I",
                  date: "September 2025",
                  location: "Kampus UPI Purwakarta",
                  duration: "2 hari",
                  desc: "Tahap pertama ROTASI dilaksanakan di kampus UPI Purwakarta dengan fokus pada pengenalan lingkungan kampus dan program studi.",
                  activities: [
                    "Pembukaan resmi ROTASI",
                    "Pengenalan lingkungan kampus dan fasilitas",
                    "Pengenalan struktur organisasi HIMA PSTI",
                    "Materi dasar-dasar akademik PSTI",
                    "Team building dan ice breaking",
                  ],
                },
                {
                  title: "ROTASI Tahap II",
                  date: "September 2025",
                  location: "Luar Kampus",
                  duration: "3 hari",
                  desc: "Tahap kedua ROTASI berupa kegiatan outbound di luar kampus untuk membangun kebersamaan dan solidaritas.",
                  activities: [
                    "Outbound dan kegiatan alam",
                    "Latihan kepemimpinan dan kerja tim",
                    "Malam keakraban dan pentas seni",
                    "Renungan dan refleksi perjalanan ROTASI",
                    "Pengukuhan sebagai mahasiswa PSTI",
                  ],
                },
                {
                  title: "Pasca-ROTASI",
                  date: "Oktober 2025",
                  location: "Kampus UPI Purwakarta",
                  duration: "Berkelanjutan",
                  desc: "Tahap maintenance untuk menjaga keaktifan anggota muda (savior muda) dan pengenalan ke Bratvacode.",
                  activities: [
                    "Evaluasi keseluruhan program ROTASI",
                    "Pengenalan Bratvacode",
                    "Kegiatan lanjutan untuk anggota muda",
                    "Monitoring dan pendampingan",
                    "Integrasi ke dalam kegiatan HIMA PSTI",
                  ],
                },
              ].map((phase, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-content w-full md:w-5/12">
                    <Card className="border-border/50">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-2xl mb-2">{phase.title}</h3>
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Calendar className="h-4 w-4" />
                            <span>{phase.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{phase.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{phase.duration}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{phase.desc}</p>
                        <div>
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            Kegiatan
                          </h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {phase.activities.map((activity, idx) => (
                              <li key={idx}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">HAK & KEWAJIBAN PESERTA</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Hak Peserta</h3>
                <ul className="space-y-3">
                  {[
                    "Mendapatkan informasi yang jelas tentang rangkaian kegiatan ROTASI",
                    "Memperoleh materi dan pengetahuan yang bermanfaat untuk pengembangan diri",
                    "Mendapatkan pendampingan dari panitia dan pembimbing selama kegiatan",
                    "Menggunakan fasilitas yang disediakan selama kegiatan berlangsung",
                    "Menyampaikan pendapat, kritik, dan saran yang konstruktif",
                    "Mendapatkan perlakuan yang adil dan setara dari panitia",
                    "Memperoleh sertifikat kelulusan setelah menyelesaikan seluruh tahapan",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Kewajiban Peserta</h3>
                <ul className="space-y-3">
                  {[
                    "Mengikuti seluruh rangkaian kegiatan ROTASI sesuai jadwal",
                    "Mematuhi peraturan dan tata tertib yang berlaku selama kegiatan",
                    "Menyelesaikan tugas dan tanggung jawab yang diberikan",
                    "Berpartisipasi aktif dalam setiap kegiatan dan diskusi",
                    "Menjaga ketertiban, kebersihan, dan kenyamanan lingkungan",
                    "Menghormati panitia, pembimbing, dan sesama peserta",
                    "Menjunjung tinggi nilai-nilai PSTI dalam setiap tindakan",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
