import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const sektor = searchParams.get('sektor')

    let users

    if (role && sektor) {
      // Get users by role and sector
      users = await authService.getUsersByRoleAndSector(role, parseInt(sektor))
    } else if (role) {
      // Get users by role only
      users = await authService.getUsersByRole(role)
    } else {
      // Get all users
      users = await authService.getAllUsers()
    }
    
    return NextResponse.json({
      success: true,
      users
    })

  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data users' },
      { status: 500 }
    )
  }
}
