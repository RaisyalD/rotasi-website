import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userType, ...data } = body

    let user

    // For admin registration, use service role to bypass RLS
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

      // Validate division password
      const { data: divisionData, error: divisionError } = await admin
        .from('division_passwords')
        .select('*')
        .eq('division_name', 'Admin')
        .eq('uuid_password', data.divisionPassword)
        .single()

      if (divisionError || !divisionData) {
        return NextResponse.json(
          { error: 'Password divisi admin tidak valid' },
          { status: 400 }
        )
      }

      // Check if email already exists
      const { data: existingUser } = await admin
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single()

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email sudah terdaftar' },
          { status: 400 }
        )
      }

      // Create admin user
      const { data: newUser, error: insertError } = await admin
        .from('users')
        .insert({
          nama_lengkap: data.nama_lengkap,
          email: data.email,
          role: 'admin',
          password_hash: data.divisionPassword,
          login_password_hash: data.loginPassword
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      user = newUser
    } else {
      // Use existing authService for other user types
      switch (userType) {
        case 'peserta':
          user = await authService.registerPeserta(data)
          break
        case 'mentor':
          user = await authService.registerMentor(data)
          break
        case 'acara':
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