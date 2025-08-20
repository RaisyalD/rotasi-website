import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
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

    const { data: me, error: meErr } = await admin
      .from('users')
      .select('id, role, sektor')
      .eq('id', cookieUserId)
      .single()
    if (meErr || !me) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = admin.from('users').select('*')

    if (me.role === 'peserta') {
      // Peserta hanya boleh melihat dirinya sendiri
      query = admin.from('users').select('*').eq('id', me.id)
    } else if (me.role === 'mentor') {
      // Mentor dibatasi pada sektornya.
      // Jika klien meminta role tertentu, hormati; default ke 'peserta'.
      query = admin.from('users').select('*').eq('sektor', me.sektor)
      if (role) {
        query = query.eq('role', role)
      } else {
        query = query.eq('role', 'peserta')
      }
    } else {
      // acara dan komdis: izinkan filter apa adanya
      if (role) {
        query = query.eq('role', role)
      }
      if (sektor) {
        query = query.eq('sektor', parseInt(sektor))
      }
    }

    const { data: users, error } = await query
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      users
    })

  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data users' },
      { status: 500 }
    )
  }
}
