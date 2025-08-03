import Link from "next/link"
import Image from "next/image"
import { Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/rotasi logo.png"
                alt="ROTASI Logo"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <div>
                <h3 className="font-bebas-neue text-2xl tracking-wider">ROTASI</h3>
                <p className="text-xs text-muted-foreground">Regenerasi dan Orientasi Mahasiswa PSTI</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Platform kaderisasi ROTASI yang dinaungi oleh HIMA PSTI UPI untuk membentuk karakter dan melanjutkan
              perjuangan PSTI.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/rotasipsti/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.youtube.com/@rotasipsti"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link
                href="mailto:himapstipwk@upi.edu"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bebas-neue text-xl mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tentang" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tentang ROTASI
                </Link>
              </li>
              <li>
                <Link href="/struktur" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Struktur Panitia
                </Link>
              </li>
              <li>
                <Link href="/tahapan" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Alur & Tahapan
                </Link>
              </li>
              <li>
                <Link
                  href="/pendaftaran"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Pendaftaran
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Galeri & Dokumentasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bebas-neue text-xl mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span>
                  Kampus UPI Purwakarta, Jl. Veteran No.8, Nagri Kaler, Kec. Purwakarta, Kabupaten Purwakarta, Jawa
                  Barat 41115
                </span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+62 812-9220-1859</span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>himapstipwk@upi.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/himapsti.jpg-FYGOXP6T1ihGQJxEaE8UOE6mfGJvVT.jpeg"
              alt="HIMA PSTI UPI Logo"
              width={30}
              height={30}
              className="h-8 w-auto"
            />
            <span className="text-xs text-muted-foreground">Dinaungi oleh HIMA PSTI UPI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ROTASI - HIMA PSTI UPI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
