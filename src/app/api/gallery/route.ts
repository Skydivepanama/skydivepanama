import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File
  const type = form.get('type') as string

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const bucket = type === 'photo' ? 'photos' : 'videos'

  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, bytes, { contentType: file.type })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

  const { error } = await supabaseAdmin.from('gallery').insert({
    type,
    url: publicUrl,
    display_order: 999,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, url: publicUrl })
}
