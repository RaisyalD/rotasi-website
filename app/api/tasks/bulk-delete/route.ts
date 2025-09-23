import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { deleteAll, taskIds } = body

    // Check authentication
    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if environment variables are configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: 'Server storage not configured. Missing SUPABASE_SERVICE_ROLE_KEY or URL.' },
        { status: 500 }
      )
    }

    // Create admin client
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Check if user has acara role
    const { data: userData, error: userError } = await admin
      .from('users')
      .select('role')
      .eq('id', cookieUserId)
      .single()

    if (userError || userData?.role !== 'acara') {
      return NextResponse.json(
        { error: 'Access denied. Only Acara can delete tasks.' },
        { status: 403 }
      )
    }

    if (deleteAll) {
      // Delete all tasks
      const { error } = await admin
        .from('tasks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // This will delete all rows

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: 'Semua tugas berhasil dihapus'
      })
    } else if (taskIds && Array.isArray(taskIds) && taskIds.length > 0) {
      // Delete specific tasks by IDs
      const { error } = await admin
        .from('tasks')
        .delete()
        .in('id', taskIds)

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: `${taskIds.length} tugas berhasil dihapus`
      })
    } else {
      return NextResponse.json(
        { error: 'Parameter tidak valid' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus tugas' },
      { status: 500 }
    )
  }
}
