import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userType, ...data } = body

    let user

    // For admin login, use service role to bypass RLS
    if (userType === 'admin') {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return NextResponse.json(
          { error: 'Server storage not configured. Missing SUPABASE_SERVICE_ROLE_KEY or URL.' },
          { status: 500 }
        )
      }

      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
      )

      const { data: userData, error } = await admin
        .from('users')
        .select('*')
        .eq('email', data.email)
        .eq('role', 'admin')
        .eq('login_password_hash', data.loginPassword)
        .eq('is_active', true)
        .single()

      if (error || !userData) {
        return NextResponse.json(
          { error: 'Data login tidak valid' },
          { status: 400 }
        )
      }

      user = userData
    } else {
      // Use existing authService for other user types
      switch (userType) {
        case 'peserta':
          user = await authService.loginPeserta(data)
          break
        case 'mentor':
          user = await authService.loginMentor(data)
          break
        case 'acara':
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
    }

    const response = NextResponse.json({
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

    // Set app session cookie for middleware-based protection
    response.cookies.set('rotasi_session', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Data login tidak valid' },
      { status: 400 }
    )
  }
} 