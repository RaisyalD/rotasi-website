import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Smartphone, Monitor, Globe, Star, CheckCircle, ArrowRight, QrCode } from "lucide-react"

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Download <span className="text-red-600 dark:text-red-400">MyRotasi</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Aplikasi resmi ROTASI untuk perangkat Android. Mudah dan praktis, akses di mana saja dan kapan saja.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg" asChild>
                <a href="https://content.rotasipsti.id/app/peserta/MyROTASI.apk" download="MyROTASI.apk">
                <Download className="h-5 w-5 mr-2" />
                Download Sekarang
                </a>
              </Button>
            </div>
          </div>

          {/* App Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Phone Mockup */}
              <div className="relative mx-auto">
                <div className="w-64 h-[500px] bg-gray-800 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    <div className="h-8 bg-gray-200 rounded-t-[2.5rem] flex items-center justify-center">
                      <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="p-6 h-full bg-gradient-to-b from-red-50 to-white">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-4 flex items-center justify-center">
                          <Image
                            src="https://content.rotasipsti.id/images/rotasi-logo.png"
                            alt="ROTASI Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                          />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">MyRotasi</h3>
                        <p className="text-sm text-gray-600 mt-2">Akses ROTASI di genggaman Anda</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Fitur Unggulan
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Kemudahan Akses</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Akses informasi ROTASI di mana saja dan kapan saja</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Ringan</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Ukuran aplikasi kecil, ramah untuk semua perangkat Android</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Tanpa Iklan</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Aplikasi 100% tanpa iklan mengganggu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Aman</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Aplikasi 100% aman tanpa virus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Requirements Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Persyaratan Minimum Sistem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pastikan perangkat Anda memenuhi persyaratan minimum untuk pengalaman optimal
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Android Requirements */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-xl">Android</CardTitle>
                <CardDescription>
                  Persyaratan untuk perangkat Android
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Android 7.0 atau lebih baru</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">RAM minimal 1GB</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Storage 10MB kosong</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Koneksi internet 4G/5G atau WiFi</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Temukan jawaban untuk pertanyaan umum tentang MyROTASI
              </p>
            </div>

            <div className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Apakah MyROTASI gratis?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Ya, MyROTASI adalah aplikasi resmi ROTASI yang dapat diunduh dan digunakan secara gratis oleh semua peserta ROTASI.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Apakah aplikasi ini aman untuk diunduh?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Tentu saja! MyROTASI adalah aplikasi resmi yang dikembangkan oleh tim ROTASI dan telah melalui proses pengujian keamanan. Aplikasi ini 100% aman tanpa virus.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Apakah ada iklan dalam aplikasi?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Tidak, MyROTASI adalah aplikasi 100% tanpa iklan. Kami berkomitmen memberikan pengalaman yang terbaik untuk peserta ROTASI.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Berapa ukuran file aplikasi?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Aplikasi MyROTASI memiliki ukuran yang sangat ringan, hanya membutuhkan sekitar 10MB storage kosong. Aplikasi ini dirancang untuk ramah dengan semua perangkat Android.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Apakah aplikasi memerlukan koneksi internet?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Ya, MyROTASI memerlukan koneksi internet untuk sinkronisasi data dan mengakses informasi terbaru. Kami merekomendasikan koneksi 4G/5G atau WiFi untuk pengalaman terbaik.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Bagaimana cara menginstal aplikasi?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Setelah mengunduh file APK, buka file tersebut di perangkat Android Anda. Jika muncul peringatan keamanan, pilih "Install from unknown sources" atau "Allow from this source" untuk melanjutkan instalasi.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Apakah aplikasi tersedia untuk perangkat iOS?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Saat ini MyROTASI hanya tersedia untuk perangkat Android. Untuk pengguna iOS, Anda dapat mengakses ROTASI melalui website resmi di browser Safari atau browser lainnya.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Bagaimana jika mengalami masalah dengan aplikasi?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Jika Anda mengalami masalah teknis atau memiliki pertanyaan tentang aplikasi, silakan hubungi tim website ROTASI melalui email hi@web.rotasipsti.id
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}
