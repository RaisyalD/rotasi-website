import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get('sector')

    const tasks = await authService.getTasks(sector ? parseInt(sector) : undefined)
    
    return NextResponse.json({
      success: true,
      tasks
    })

  } catch (error: any) {
    console.error('Get tasks error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data tugas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, sector, due_date, userId } = body

    if (!title || !description || !sector || !due_date || !userId) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Validate caller identity via cookie to avoid spoofed userId
    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId || cookieUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: 'Server storage not configured. Missing SUPABASE_SERVICE_ROLE_KEY or URL.' },
        { status: 500 }
      )
    }

    // Use service role client to comply with RLS while enforcing our own checks
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Check if user has acara role
    const { data: userData, error: userError } = await admin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (userError || userData?.role !== 'acara') {
      return NextResponse.json(
        { error: 'Access denied. Only Acara can create tasks.' },
        { status: 403 }
      )
    }

    const { data: task, error: insertError } = await admin
      .from('tasks')
      .insert({
        title,
        description,
        sector: parseInt(sector),
        due_date,
        created_by: userId
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }
    
    return NextResponse.json({
      success: true,
      task
    })

  } catch (error: any) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat tugas' },
      { status: 500 }
    )
  }
}
