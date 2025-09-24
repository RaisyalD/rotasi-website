import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

export const handler = async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const sector = formData.get('sector') as string | null
    const userId = formData.get('user_id') as string | null

    if (!file || !sector || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const sectorRegex = /^sektor-([1-9]|10)$/
    if (!sectorRegex.test(String(sector))) {
      return new Response(
        JSON.stringify({ error: 'Invalid sector format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const fileExtension = file.name.split('.').pop() ?? 'zip'
    const uniqueFilename = `${crypto.randomUUID()}.${fileExtension}`
    const filePath = `${sector}/${userId}/${uniqueFilename}`

    const { data, error } = await supabase.storage
      .from('rotasi-files')
      .upload(filePath, file)

    if (error) throw error

    const { data: uploadRecord, error: recordError } = await supabase
      .from('sector_uploads')
      .insert({
        user_id: userId,
        sector_id: parseInt(String(sector).split('-')[1]),
        file_path: filePath,
        metadata: {
          original_filename: file.name,
          file_size: (file as any).size,
          mime_type: (file as any).type,
        }
      })
      .select()

    if (recordError) throw recordError

    return new Response(
      JSON.stringify({ message: 'File uploaded successfully', file: data, record: uploadRecord }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ error: 'Upload failed', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Deno entrypoint
// @ts-ignore
Deno.serve(handler)


