import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const participantId = searchParams.get('participantId')
    const sector = searchParams.get('sector')

    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Get caller role
    const { data: me, error: meErr } = await admin
      .from('users')
      .select('role, sektor')
      .eq('id', cookieUserId)
      .single()
    if (meErr || !me) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = admin
      .from('task_submissions')
      .select(`
        *,
        tasks!inner (
          id,
          title,
          description,
          sector,
          due_date
        ),
        participants:users!task_submissions_participant_id_fkey (
          id,
          nama_lengkap,
          nim,
          email
        ),
        evaluators:users!task_submissions_evaluated_by_fkey (
          id,
          nama_lengkap
        )
      `)
      .order('submitted_at', { ascending: false })

    if (taskId) {
      query = query.eq('task_id', taskId)
    }
    if (sector) {
      query = query.eq('tasks.sector', parseInt(sector))
    }

    // Authorization: peserta can only see their own submissions
    if (me.role === 'peserta') {
      // Ignore participantId filter from client; always scope to self
      query = query.eq('participant_id', cookieUserId)
    } else if (me.role === 'mentor') {
      // Mentors are restricted to their sector by default
      // If caller did not pass sector filter, enforce it
      if (!sector) {
        query = query.eq('tasks.sector', me.sektor)
      }
    }

    const { data: submissions, error } = await query
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      submissions
    })

  } catch (error: any) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data submission' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { task_id, participant_id, submission_text, file_url, file_name } = body

    if (!task_id) {
      return NextResponse.json(
        { error: 'Task ID harus diisi' },
        { status: 400 }
      )
    }

    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Validate role is peserta
    const { data: me, error: meErr } = await admin
      .from('users')
      .select('id, role')
      .eq('id', cookieUserId)
      .single()
    if (meErr || !me || me.role !== 'peserta') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: submission, error } = await admin
      .from('task_submissions')
      .insert({
        task_id,
        participant_id: cookieUserId,
        submission_text,
        file_url,
        file_name
      })
      .select()
      .single()
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      submission
    })

  } catch (error: any) {
    console.error('Create submission error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat submission' },
      { status: 500 }
    )
  }
}
