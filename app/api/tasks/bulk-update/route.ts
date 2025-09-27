import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskIds, updateData } = body

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
        { error: 'Access denied. Only Acara can update tasks.' },
        { status: 403 }
      )
    }

    // Validate input
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { error: 'Task IDs are required' },
        { status: 400 }
      )
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Update data is required' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updatePayload: any = {}
    if (updateData.title !== undefined) updatePayload.title = updateData.title
    if (updateData.description !== undefined) updatePayload.description = updateData.description
    if (updateData.due_date !== undefined) updatePayload.due_date = updateData.due_date
    if (updateData.task_type !== undefined) updatePayload.task_type = updateData.task_type
    if (updateData.status !== undefined) updatePayload.status = updateData.status

    // Update tasks
    const { data: updatedTasks, error } = await admin
      .from('tasks')
      .update(updatePayload)
      .in('id', taskIds)
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `${updatedTasks.length} tugas berhasil diupdate`,
      tasks: updatedTasks
    })

  } catch (error: any) {
    console.error('Bulk update error:', error)
    return NextResponse.json(
      { error: error.message || 'Gagal mengupdate tugas' },
      { status: 500 }
    )
  }
}
