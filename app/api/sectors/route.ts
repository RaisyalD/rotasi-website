import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('Sectors API called')
    
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    console.log('Attempting to fetch sectors from database')
    
    const { data, error } = await supabase
      .from('sector_passwords')
      .select('sector_number, sector_name')
      .order('sector_number')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      )
    }

    console.log('Sectors fetched successfully:', data)
    
    return NextResponse.json({
      success: true,
      sectors: data
    })

  } catch (error: any) {
    console.error('Get sectors error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data sektor: ' + error.message },
      { status: 500 }
    )
  }
} 