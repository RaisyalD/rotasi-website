import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, sector, due_date, status } = body

    const task = await authService.updateTask(params.id, {
      title,
      description,
      sector: sector ? parseInt(sector) : undefined,
      due_date,
      status
    })
    
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
    await authService.deleteTask(params.id)
    
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
