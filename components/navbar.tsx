"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/tentang" },
  { name: "Struktur", href: "/struktur" },
  { name: "Tahapan", href: "/tahapan" },
  { name: "Tugas", href: "/tugas" },
  { name: "Galeri", href: "/galeri" },
  { name: "Kontak", href: "/kontak" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    // Set initial scroll state
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Don't render scroll-dependent classes until mounted
  const headerClasses = mounted 
    ? cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent",
      )
    : "fixed top-0 w-full z-50 bg-transparent"

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/rotasi logo.png"
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

            {user ? (
              <div className="relative group">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.nama_lengkap}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border/50 overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-accent">
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-accent text-red-600"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <Button variant="outline" className="flex items-center gap-2">
                  Daftar
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border/50 overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link href="/auth/register-divisi" className="block px-4 py-2 text-sm hover:bg-accent">
                      Register
                    </Link>
                    <Link href="/auth/login" className="block px-4 py-2 text-sm hover:bg-accent">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            )}
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
            {user ? (
              <div className="border-t border-border/50 pt-2 mt-2">
                <p className="text-xs font-semibold mb-1 text-foreground/60">User</p>
                <Link href="/dashboard" className="block py-2 text-sm hover:text-primary" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left py-2 text-sm hover:text-primary text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-border/50 pt-2 mt-2">
                <p className="text-xs font-semibold mb-1 text-foreground/60">Daftar</p>
                <Link href="/auth/register-divisi" className="block py-2 text-sm hover:text-primary" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
                <Link href="/auth/login" className="block py-2 text-sm hover:text-primary" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
