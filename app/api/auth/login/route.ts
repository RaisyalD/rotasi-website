import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userType, ...data } = body

    let user

    switch (userType) {
      case 'peserta':
        user = await authService.loginPeserta(data)
        break
      case 'mentor':
        user = await authService.loginMentor(data)
        break
      case 'acara':
      case 'komdis':
        user = await authService.loginDivisi({
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
      message: 'Login berhasil',
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
        sektor: user.sektor,
        email: user.email,
        nim: user.nim
      }
    })

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Data login tidak valid' },
      { status: 400 }
    )
  }
} 