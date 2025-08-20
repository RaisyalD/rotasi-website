import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('x-seed-token')
    if (!authHeader || authHeader !== process.env.SEED_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Missing SUPABASE config' },
        { status: 500 }
      )
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    // Create zero-byte placeholder for sektor-1..sektor-10
    for (let i = 1; i <= 10; i++) {
      const folder = `sektor-${i}`
      const keepPath = `${folder}/.keep`
      // Upload only if not exists
      const { data: head } = admin.storage.from('rotasi-files').getPublicUrl(keepPath)
      // Try upload; ignore conflict
      await admin.storage
        .from('rotasi-files')
        .upload(keepPath, new Blob([]), { upsert: false })
        .catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Seed failed', details: error.message }, { status: 500 })
  }
}


