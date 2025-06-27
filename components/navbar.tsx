"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/tentang" },
  { name: "Struktur", href: "/struktur" },
  { name: "Tahapan", href: "/tahapan" },
  { name: "Pendaftaran", href: "/pendaftaran" },
  { name: "Tugas", href: "/tugas" },
  { name: "Galeri", href: "/galeri" },
  { name: "Kontak", href: "/kontak" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rotasi.jpg-WzsprUfnVlIPqWrUG49J5kjH7LPv2c.jpeg"
              alt="ROTASI Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="font-bebas-neue text-2xl tracking-wider text-white">ROTASI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="relative group">
              <Button variant="outline" className="flex items-center gap-2">
                Fitur
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border/50 overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/tentang" className="block px-4 py-2 text-sm hover:bg-accent">
                    Informasi Kegiatan
                  </Link>
                  <Link href="/tahapan" className="block px-4 py-2 text-sm hover:bg-accent">
                    Alur & Tahapan
                  </Link>
                  <Link href="/struktur" className="block px-4 py-2 text-sm hover:bg-accent">
                    Struktur Kepanitiaan
                  </Link>
                  <Link href="/galeri" className="block px-4 py-2 text-sm hover:bg-accent">
                    Galeri & Dokumentasi
                  </Link>
                  <Link href="/tentang#hima-psti" className="block px-4 py-2 text-sm hover:bg-accent">
                    Profil HIMA PSTI
                  </Link>
                </div>
              </div>
            </div>
            <Button asChild variant="default" className="bg-maroon hover:bg-maroon-light">
              <Link href="/pendaftaran">Daftar Sekarang</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border/50 py-4 animate-fade-in">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium py-2 text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild variant="default" className="mt-2 bg-maroon hover:bg-maroon-light">
              <Link href="/pendaftaran" onClick={() => setIsOpen(false)}>
                Daftar Sekarang
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
