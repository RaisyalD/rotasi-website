import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'task-submissions'
    const taskId = (formData.get('task_id') as string) || null
    const sectorOverride = formData.get('sector') as string | null

    const cookieUserId = request.cookies.get('rotasi_session')?.value
    if (!cookieUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    // Validate type and size (zip, <= 10MB)
    const isZip = file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')
    if (!isZip) {
      return NextResponse.json(
        { error: 'Hanya file .zip yang diperbolehkan' },
        { status: 400 }
      )
    }
    const maxBytes = 10 * 1024 * 1024
    if ((file as any).size && (file as any).size > maxBytes) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 10MB' },
        { status: 400 }
      )
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Resolve sector: prefer task.sector if task_id provided, else user's sektor
    let resolvedSector: number | null = null
    // Highest precedence: explicit sector from client (validated 1..10)
    if (sectorOverride) {
      const s = parseInt(String(sectorOverride), 10)
      if (!Number.isNaN(s) && s >= 1 && s <= 10) {
        resolvedSector = s
      }
    }
    if (taskId) {
      const { data: task, error: taskErr } = await admin
        .from('tasks')
        .select('sector')
        .eq('id', taskId)
        .single()
      if (taskErr) {
        return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 })
      }
      if (resolvedSector === null) {
        resolvedSector = task?.sector ?? null
      }
    }
    if (resolvedSector === null) {
      const { data: me, error: meErr } = await admin
        .from('users')
        .select('sektor')
        .eq('id', cookieUserId)
        .single()
      if (meErr || !me) {
        return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
      }
      resolvedSector = me.sektor ?? null
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const sectorFolder = `sektor-${resolvedSector ?? 'unknown'}`
    const filePath = `${sectorFolder}/${cookieUserId}/${folder}/${timestamp}-${file.name}`

    // Upload to Supabase Storage
    const { data, error } = await admin.storage
      .from('rotasi-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: 'Gagal mengupload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = admin.storage
      .from('rotasi-files')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      filePath
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupload file' },
      { status: 500 }
    )
  }
}
