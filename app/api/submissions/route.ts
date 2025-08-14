import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const participantId = searchParams.get('participantId')
    const sector = searchParams.get('sector')

    const submissions = await authService.getTaskSubmissions(
      taskId || undefined,
      participantId || undefined,
      sector ? parseInt(sector) : undefined
    )
    
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

    if (!task_id || !participant_id) {
      return NextResponse.json(
        { error: 'Task ID dan Participant ID harus diisi' },
        { status: 400 }
      )
    }

    const submission = await authService.createTaskSubmission({
      task_id,
      participant_id,
      submission_text,
      file_url,
      file_name
    })
    
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
