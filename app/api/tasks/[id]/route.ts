import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, sector, due_date, status } = body

    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Ensure only acara can update
    const { data: me, error: meErr } = await admin
      .from('users')
      .select('role')
      .eq('id', cookieUserId)
      .single()
    if (meErr || me?.role !== 'acara') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: task, error } = await admin
      .from('tasks')
      .update({
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(sector !== undefined ? { sector: parseInt(sector) } : {}),
        ...(due_date !== undefined ? { due_date } : {}),
        ...(status !== undefined ? { status } : {}),
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      task
    })

  } catch (error: any) {
    console.error('Update task error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate tugas' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Ensure only acara can delete
    const { data: me, error: meErr } = await admin
      .from('users')
      .select('role')
      .eq('id', cookieUserId)
      .single()
    if (meErr || me?.role !== 'acara') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await admin
      .from('tasks')
      .delete()
      .eq('id', params.id)
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      message: 'Tugas berhasil dihapus'
    })

  } catch (error: any) {
    console.error('Delete task error:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus tugas' },
      { status: 500 }
    )
  }
}
