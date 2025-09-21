import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userType, ...data } = body

    let user

    switch (userType) {
      case 'peserta':
        user = await authService.registerPeserta(data)
        break
      case 'mentor':
        user = await authService.registerMentor(data)
        break
      case 'acara':
      case 'komdis':
        user = await authService.registerDivisi({
          ...data,
          role: userType
        })
        break
      default:
        return NextResponse.json(
          { error: 'Tipe user tidak valid' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
        sektor: user.sektor
      }
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat registrasi' },
      { status: 400 }
    )
  }
} 