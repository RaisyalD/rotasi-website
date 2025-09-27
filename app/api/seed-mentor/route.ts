import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Create a mentor for sector 7
    const { data: mentor, error } = await admin
      .from('users')
      .insert({
        nama_lengkap: 'Dadang Sektor 7',
        email: 'dadang.sektor7@rotasi.com',
        role: 'mentor',
        sektor: 7,
        password_hash: 'abc-123', // Default sector password
        login_password_hash: 'mentor123',
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating mentor:', error)
      return NextResponse.json(
        { error: 'Gagal membuat mentor' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mentor berhasil dibuat',
      mentor
    })

  } catch (error: any) {
    console.error('Seed mentor error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat mentor' },
      { status: 500 }
    )
  }
}
