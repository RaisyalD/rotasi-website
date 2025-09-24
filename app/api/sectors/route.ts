import { NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'

export async function GET() {
  try {
    const sectors = await authService.getSectors()
    
    return NextResponse.json({
      success: true,
      sectors
    })

  } catch (error: any) {
    console.error('Get sectors error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data sektor' },
      { status: 500 }
    )
  }
} 