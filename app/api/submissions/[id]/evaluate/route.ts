import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { evaluation_score, evaluation_comment, userId, approved } = body

    if (approved === undefined && (!userId || evaluation_score === undefined || !evaluation_comment)) {
      return NextResponse.json(
        { error: 'Parameter tidak lengkap' },
        { status: 400 }
      )
    }

    // Check if user has acara role
    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId || cookieUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: userData, error: userError } = await admin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (userError || userData?.role !== 'acara') {
      return NextResponse.json(
        { error: 'Access denied. Only Acara can evaluate submissions.' },
        { status: 403 }
      )
    }

    // Map approved flag to status and score if provided
    let mappedStatus: 'evaluated' | 'rejected' | undefined
    let mappedScore: number | undefined
    if (typeof approved === 'boolean') {
      mappedStatus = approved ? 'evaluated' : 'rejected'
      mappedScore = approved ? 1 : 0
    }

    const { data: submission, error } = await admin
      .from('task_submissions')
      .update({
        evaluation_score: mappedScore ?? (evaluation_score !== undefined ? parseInt(evaluation_score) : undefined),
        evaluation_comment,
        evaluated_by: userId,
        status: mappedStatus ?? 'evaluated',
        evaluated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      submission
    })

  } catch (error: any) {
    console.error('Evaluate submission error:', error)
    return NextResponse.json(
      { error: 'Gagal mengevaluasi submission' },
      { status: 500 }
    )
  }
}
