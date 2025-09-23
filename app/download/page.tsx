import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, Star, Users, Calendar, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Unduh Aplikasi <span className="text-primary">MyROTASI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Nikmati pengalaman ROTASI yang lebih mudah dan praktis dengan aplikasi MyROTASI. 
            Akses semua fitur dan informasi ROTASI langsung dari smartphone Anda.
          </p>
        </div>

        {/* Main Download Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-2xl flex items-center justify-center p-2">
                <Image
                  src="https://content.rotasipsti.id/images/rotasi-logo.png"
                  alt="ROTASI Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-4">
                MyROTASI
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Aplikasi resmi ROTASI untuk Android
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Download Button */}
              <div className="text-center">
                <Link href="http://content.rotasipsti.id/app/peserta/MyROTASI.apk" target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg" 
                    className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Unduh Aplikasi
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground mt-3">
                  Gratis • Aman • Mudah Digunakan
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Informasi ROTASI</h3>
                  <p className="text-sm text-muted-foreground">
                    Pantau informasi terbaru secara real-time
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Aplikasi Ringan</h3>
                  <p className="text-sm text-muted-foreground">
                    Ukuran aplikasi ringan hanya 6MB
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Keamanan</h3>
                  <p className="text-sm text-muted-foreground">
                    Data dan privasi Anda terlindungi dengan aman
                  </p>
                </div>
              </div>

              {/* Android Only Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Smartphone className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-2" />
                  <span className="font-semibold text-amber-800 dark:text-amber-200">Khusus Android</span>
                </div>
                <p className="text-amber-700 dark:text-amber-300">
                  Saat ini MyROTASI hanya tersedia untuk perangkat Android. 
                  Perangkat iPhone akses via website
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Kenapa harus install?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Akses informasi ROTASI kapan saja dan dimana saja</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Aplikasi ringan untuk semua perangkat</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Interface yang user-friendly dan modern</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Gratis, dan tanpa iklan</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Persyaratan sistem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Android 7.0 atau lebih baru</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Koneksi internet seluler 4G/5G atau WiFi</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">RAM minimal 1GB</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Penyimpanan internal yang cukup</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Siap Memulai Perjalanan ROTASI?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unduh aplikasi MyROTASI sekarang 
            dan nikmati pengalaman yang lebih baik.
          </p>
          <Link href="http://content.rotasipsti.id/app/peserta/MyROTASI.apk" target="_blank" rel="noopener noreferrer">
            <Button 
              size="lg" 
              className="px-12 py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Download className="w-6 h-6 mr-3" />
              Unduh Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
