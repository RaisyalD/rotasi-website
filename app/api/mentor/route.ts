import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sektor = searchParams.get('sektor')

    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Verify user exists and get their role
    const { data: me, error: meErr } = await admin
      .from('users')
      .select('id, role, sektor')
      .eq('id', cookieUserId)
      .single()
    
    if (meErr || !me) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Allow peserta to get mentor info for their sector
    if (me.role === 'peserta' && sektor && parseInt(sektor) === me.sektor) {
      const { data: mentors, error } = await admin
        .from('users')
        .select('id, nama_lengkap, email, role, sektor')
        .eq('role', 'mentor')
        .eq('sektor', parseInt(sektor))
        .eq('is_active', true)

      if (error) throw error
      
      return NextResponse.json({
        success: true,
        mentors: mentors || []
      })
    }

    // For other roles, use the same logic as users API
    if (me.role === 'mentor') {
      const { data: mentors, error } = await admin
        .from('users')
        .select('id, nama_lengkap, email, role, sektor')
        .eq('role', 'mentor')
        .eq('sektor', me.sektor)
        .eq('is_active', true)

      if (error) throw error
      
      return NextResponse.json({
        success: true,
        mentors: mentors || []
      })
    }

    // For acara and komdis, allow any sector
    let query = admin
      .from('users')
      .select('id, nama_lengkap, email, role, sektor')
      .eq('role', 'mentor')
      .eq('is_active', true)

    if (sektor) {
      query = query.eq('sektor', parseInt(sektor))
    }

    const { data: mentors, error } = await query
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      mentors: mentors || []
    })

  } catch (error: any) {
    console.error('Get mentor error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data mentor' },
      { status: 500 }
    )
  }
}
