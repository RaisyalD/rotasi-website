import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { evaluation_score, evaluation_comment, userId } = body

    if (!evaluation_score || !evaluation_comment || !userId) {
      return NextResponse.json(
        { error: 'Semua field evaluasi harus diisi' },
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
        { error: 'Access denied. Only Acara can evaluate submissions.' },
        { status: 403 }
      )
    }

    const submission = await authService.evaluateTaskSubmission(params.id, {
      evaluation_score: parseInt(evaluation_score),
      evaluation_comment,
      evaluated_by: userId
    })
    
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
