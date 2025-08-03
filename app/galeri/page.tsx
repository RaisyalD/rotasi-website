import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function GaleriPage() {
  const galleryData = {
    "2024": [
      {
        src: "/placeholder.svg?height=400&width=600",
        alt: "ROTASI 2024 - Pembukaan",
        caption: "Pembukaan ROTASI 2024",
      },
      {
        src: "/placeholder.svg?height=400&width=600",
        alt: "ROTASI 2024 - Diskusi Kelompok",
        caption: "Diskusi Kelompok",
      },
      { src: "/placeholder.svg?height=400&width=600", alt: "ROTASI 2024 - Outbound", caption: "Kegiatan Outbound" },
      { src: "/placeholder.svg?height=400&width=600", alt: "ROTASI 2024 - Presentasi", caption: "Sesi Presentasi" },
      {
        src: "/placeholder.svg?height=400&width=600",
        alt: "ROTASI 2024 - Malam Keakraban",
        caption: "Malam Keakraban",
      },
      {
        src: "/placeholder.svg?height=400&width=600",
        alt: "ROTASI 2024 - Penutupan",
        caption: "Penutupan ROTASI 2024",
      },
    ],
    "2023": [
      {
        src: "/placeholder.svg?height=400&width=600",
        alt: "ROTASI 2023 - Pembukaan",
        caption: "Pembukaan ROTASI 2023",
      },
      { src: "/placeholder.svg?height=400&width=600", alt: "ROTASI 2023 - Workshop", caption: "Workshop Teknologi" },
      { src: "/placeholder.svg?height=400&width=600", alt: "ROTASI 2023 - Team Building", caption: "Team Building" },
      { src: "/placeholder.svg?height=400&width=600", alt: "ROTASI 2023 - Diskusi Panel", caption: "Diskusi Panel" },
      { src: "/placeholder.svg?height=400&width=600", alt: "ROTASI 2023 - Pentas Seni", caption: "Pentas Seni" },
      {
        src: "/placeholder.svg?height=400&width=600",
        alt: "ROTASI 2023 - Penutupan",
        caption: "Penutupan ROTASI 2023",
      },
    ],
  }

  const testimoniData = [
    {
      name: "Fahri Bintang",
      angkatan: "2024",
      photo: "/fahri.png",
      text: "ROTASI memberikan saya pengalaman yang luar biasa. Saya belajar banyak tentang kerja tim, kepemimpinan, dan nilai-nilai PSTI yang akan saya bawa sepanjang perkuliahan.",
    },
    {
      name: "Putri Apriyanti",
      angkatan: "2024",
      photo: "/putri.png",
      text: "Melalui ROTASI, saya menemukan keluarga baru di PSTI. Kegiatan ini membentuk karakter saya dan mempersiapkan saya menghadapi tantangan perkuliahan dengan lebih baik.",
    },
    {
      name: "Ariestama Putra",
      angkatan: "2023",
      photo: "/ariestama.png",
      text: "Awalnya saya ragu mengikuti ROTASI, tapi ternyata ini adalah keputusan terbaik. Saya mendapatkan banyak pengetahuan dan keterampilan yang tidak bisa didapatkan di kelas.",
    },
    {
      name: "Rheindy Ari Laksono",
      angkatan: "2023",
      photo: "/reindy.png",
      text: "ROTASI adalah pengalaman yang tak terlupakan. Selain mendapatkan teman baru, saya juga belajar tentang nilai-nilai penting yang membentuk jati diri mahasiswa PSTI.",
    },
  ]

  return (
    <>
      <section className="pt-32 pb-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">GALERI & DOKUMENTASI</h1>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-8" />

            <p className="text-lg text-center mb-8">
              Lihat dokumentasi kegiatan ROTASI dari tahun ke tahun dan testimoni dari para Savior.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="2024" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="2024">ROTASI 2024</TabsTrigger>
                <TabsTrigger value="2023">ROTASI 2023</TabsTrigger>
              </TabsList>

              {Object.entries(galleryData).map(([year, images]) => (
                <TabsContent key={year} value={year}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="relative h-48 sm:h-56 w-full">
                          <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm text-center text-muted-foreground">{image.caption}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">TESTIMONI SAVIOR</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-12" />

            <div className="grid md:grid-cols-2 gap-8">
              {testimoniData.map((testimoni, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                        <Image
                          src={testimoni.photo || "/placeholder.svg"}
                          alt={testimoni.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">{testimoni.name}</h3>
                        <p className="text-sm text-primary">Angkatan {testimoni.angkatan}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimoni.text}"</p>
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
            <h2 className="text-3xl font-bold mb-6 text-center">VIDEO HIGHLIGHT</h2>
            <Separator className="w-24 h-1 bg-primary mx-auto mb-12" />

            <div className="aspect-video bg-card border border-border/50 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/qmns3AoVJUE?si=_k4m5LfPnZytdVQa"
                title="After Movie ROTASI 2024"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Kunjungi juga channel YouTube kami untuk melihat lebih banyak video dokumentasi kegiatan ROTASI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
