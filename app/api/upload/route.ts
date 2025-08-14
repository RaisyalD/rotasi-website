import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'task-submissions'

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${folder}/${timestamp}-${file.name}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('rotasi-files')
      .upload(fileName, file, {
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
    const { data: urlData } = supabase.storage
      .from('rotasi-files')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      filePath: fileName
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Gagal mengupload file' },
      { status: 500 }
    )
  }
}
