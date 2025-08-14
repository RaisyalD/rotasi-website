import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

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

    // Check if user has acara role
    const { data: userData, error: userError } = await supabase
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

    const task = await authService.createTask({
      title,
      description,
      sector: parseInt(sector),
      due_date,
      created_by: userId
    })
    
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
