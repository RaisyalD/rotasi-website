import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { task_id, participant_id, submission_text, file_url, file_name } = body
    const submissionId = params.id

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

    // Check if submission exists and belongs to the user
    const { data: existingSubmission, error: existingError } = await admin
      .from('task_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('participant_id', cookieUserId)
      .single()

    if (existingError || !existingSubmission) {
      return NextResponse.json({ error: 'Submission tidak ditemukan' }, { status: 404 })
    }

    // Update submission
    const { data: submission, error } = await admin
      .from('task_submissions')
      .update({
        task_id,
        participant_id: cookieUserId,
        submission_text,
        file_url,
        file_name,
        submitted_at: new Date().toISOString() // Update submission time
      })
      .eq('id', submissionId)
      .select()
      .single()
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      submission
    })

  } catch (error: any) {
    console.error('Update submission error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate submission' },
      { status: 500 }
    )
  }
}
