import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Mail } from "lucide-react"

export default function StrukturPage() {
  const panitiaData = [
    {
      position: "Penanggung Jawab",
      name: "Rheindy Ari Laksono",
      photo: "/reironaldo.jpg?height=300&width=300",
      instagram: "rotasipsti",
      email: "rotasi@psti.upi.edu",
      description: "Bertanggung jawab atas keseluruhan kegiatan ROTASI 2025.",
    },
    {
      position: "Steering Committee",
      name: "Rhezwan & Ariestama",
      photo: "https://content.rotasipsti.id/images/stakeholder/IMG_7529.jpg?height=300&width=300",
      instagram: "himapstiupi",
      email: "himapsti@upi.edu",
      description: "Memberikan arahan dan pengawasan terhadap pelaksanaan ROTASI 2025.",
    },
    {
      position: "Ketua Pelaksana",
      name: "Fahri Bintang",
      photo: "https://content.rotasipsti.id/images/stakeholder/yosmar.jpg?height=300&width=300",
      instagram: "rotasipsti",
      email: "rotasi@psti.upi.edu",
      description: "Bertanggung jawab atas keseluruhan pelaksanaan ROTASI 2025.",
    },
  ]

  const divisiData = [
    {
      name: "Divisi Sekretaris",
      members: [
        { position: "Koordinator", name: "Sayyidah Muthiara Kamilah" },
        { position: "Wakil Koordinator", name: "Septiana Putri" },
      ],
      description: "Mengelola administrasi dan dokumentasi kegiatan ROTASI.",
    },
    {
      name: "Divisi Bendahara",
      members: [
        { position: "Koordinator", name: "Niha Karina Azzahra" },
        { position: "Wakil Koordinator", name: "Indri Rahmawati" },
      ],
      description: "Bertanggung jawab atas pengelolaan keuangan dan anggaran kegiatan ROTASI.",
    },
    {
      name: "Divisi Acara",
      members: [
        { position: "Koordinator", name: "Octavian Purwa Ramadhani Hidayat" },
        { position: "Wakil Koordinator", name: "Amara Seviany" },
      ],
      description: "Bertanggung jawab atas perencanaan dan pelaksanaan seluruh rangkaian acara ROTASI.",
    },
    {
      name: "Divisi Relasi",
      members: [
        { position: "Koordinator", name: "Muhammad Raffi Akhdan" },
        { position: "Wakil Koordinator", name: "Nabila Ramadhani" },
      ],
      description: "Bertanggung jawab atas hubungan dengan pihak eksternal dan sponsorship.",
    },
    {
      name: "Divisi Mentor",
      members: [
        { position: "Koordinator", name: "Alica Azwa Nayla" },
        { position: "Wakil Koordinator", name: "Ilham Agung Pambudi" },
      ],
      description: "Bertanggung jawab atas pembimbingan peserta selama kegiatan ROTASI.",
    },
    {
      name: "Divisi Keamanan",
      members: [
        { position: "Koordinator", name: "Rifat Ali Nurjaman" },
        { position: "Wakil Koordinator", name: "Aryo Bayu Fauzan Ramadhan" },
      ],
      description: "Bertanggung jawab atas keamanan dan ketertiban selama kegiatan ROTASI.",
    },
    {
      name: "Divisi Kreatif",
      members: [
        { position: "Koordinator", name: "Dara Puspita" },
        { position: "Wakil Koordinator", name: "Agizka Rizqta" },
      ],
      description: "Bertanggung jawab atas desain dan konten kreatif untuk kegiatan ROTASI.",
    },
    {
      name: "Divisi Pendanaan",
      members: [
        { position: "Koordinator", name: "Siti Shofa" },
        { position: "Wakil Koordinator", name: "Ismawatus Nurul Fadhilah" },
      ],
      description: "Bertanggung jawab atas pencarian dana dan sponsorship untuk kegiatan ROTASI.",
    },
    {
      name: "Divisi Inventaris",
      members: [
        { position: "Koordinator", name: "Amirul Muhammad Rabbani" },
        { position: "Wakil Koordinator", name: "Fikriansyah Haikal Ramadhan" },
      ],
      description: "Bertanggung jawab atas penyediaan dan pengelolaan perlengkapan kegiatan.",
    },
    {
      name: "Divisi Konsumsi",
      members: [
        { position: "Koordinator", name: "Hanifah Nurul Aini" },
        { position: "Wakil Koordinator", name: "Naufal Hazazi Dzil Ikram" },
      ],
      description: "Bertanggung jawab atas penyediaan konsumsi selama kegiatan ROTASI.",
    },
    {
      name: "Divisi Medis",
      members: [
        { position: "Koordinator", name: "Salsabila Bunga Azzahra" },
        { position: "Wakil Koordinator", name: "Ibnaty Alilatulbariza" },
      ],
      description: "Bertanggung jawab atas kesehatan dan pertolongan pertama selama kegiatan ROTASI.",
    },
    {
      name: "Divisi Komdis",
      members: [
        { position: "Koordinator", name: "Anggita Fitri Permatasari" },
        { position: "Wakil Koordinator", name: "Salwa Aulia" },
      ],
      description: "Bertanggung jawab atas kedisiplinan dan ketertiban peserta selama kegiatan ROTASI.",
    },
  ]

  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">STRUKTUR PANITIA</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <p className="text-lg text-center mb-8">
              Kenali tim yang akan membimbing dan mendampingi Anda selama kegiatan ROTASI 2025.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">STAKEHOLDERS</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-12" />

            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {panitiaData.map((panitia, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-primary">
                    <Image src={panitia.photo || "/placeholder.svg"} alt={panitia.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{panitia.name}</h3>
                  <p className="text-primary font-medium mb-2">{panitia.position}</p>
                  <div className="flex gap-3 mb-3">
                    <a
                      href={`https://instagram.com/${panitia.instagram}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </a>
                    <a
                      href={`mailto:${panitia.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="sr-only">Email</span>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">{panitia.description}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">DIVISI</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-12" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {divisiData.map((divisi, index) => (
                <Card key={index} className="border-border/50 w-full max-w-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">{divisi.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{divisi.description}</p>
                    <Separator className="my-4" />
                    <ul className="space-y-2">
                      {divisi.members.map((member, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-sm text-muted-foreground">{member.position}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
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
