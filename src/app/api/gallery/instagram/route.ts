import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const IG_TOKEN = process.env.INSTAGRAM_TOKEN
const GRAPH = 'https://graph.facebook.com/v18.0'

async function getIgAccountId(): Promise<string> {
  const res = await fetch(`${GRAPH}/me?fields=instagram_business_account&access_token=${IG_TOKEN}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  if (!data.instagram_business_account?.id) throw new Error('No Instagram Business Account linked to this page.')
  return data.instagram_business_account.id
}

// GET /api/gallery/instagram — fetch recent Instagram media
export async function GET() {
  try {
    const igId = await getIgAccountId()

    const res = await fetch(
      `${GRAPH}/${igId}/media?fields=id,media_type,media_url,thumbnail_url,caption,timestamp&limit=50&access_token=${IG_TOKEN}`
    )
    const data = await res.json()
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 })

    // Only return IMAGE and VIDEO types (skip CAROUSEL_ALBUM containers)
    const items = (data.data ?? []).filter(
      (m: { media_type: string }) => m.media_type === 'IMAGE' || m.media_type === 'VIDEO'
    )

    return NextResponse.json({ items })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error fetching Instagram media'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// POST /api/gallery/instagram — import selected items by their Instagram media IDs
export async function POST(req: NextRequest) {
  try {
    const { ids }: { ids: string[] } = await req.json()
    if (!ids?.length) return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })

    const results: { id: string; success: boolean; error?: string }[] = []

    for (const mediaId of ids) {
      try {
        // Re-fetch fresh URL for this media item
        const metaRes = await fetch(
          `${GRAPH}/${mediaId}?fields=media_type,media_url,thumbnail_url,caption&access_token=${IG_TOKEN}`
        )
        const meta = await metaRes.json()
        if (meta.error) throw new Error(meta.error.message)

        const isVideo = meta.media_type === 'VIDEO'
        const fileUrl: string = meta.media_url
        const type = isVideo ? 'video' : 'photo'
        const bucket = type === 'photo' ? 'photos' : 'videos'

        // Download the media
        const fileRes = await fetch(fileUrl)
        if (!fileRes.ok) throw new Error('Failed to download media')
        const buffer = await fileRes.arrayBuffer()
        const contentType = fileRes.headers.get('content-type') ?? (isVideo ? 'video/mp4' : 'image/jpeg')
        const ext = contentType.split('/')[1]?.split(';')[0] ?? (isVideo ? 'mp4' : 'jpg')
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabaseAdmin.storage
          .from(bucket)
          .upload(fileName, buffer, { contentType })

        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

        // Handle optional thumbnail for videos
        let thumbnailUrl: string | undefined
        if (isVideo && meta.thumbnail_url) {
          const thumbRes = await fetch(meta.thumbnail_url)
          if (thumbRes.ok) {
            const thumbBuf = await thumbRes.arrayBuffer()
            const thumbName = `thumb-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
            await supabaseAdmin.storage.from('photos').upload(thumbName, thumbBuf, { contentType: 'image/jpeg' })
            const { data: { publicUrl: tUrl } } = supabaseAdmin.storage.from('photos').getPublicUrl(thumbName)
            thumbnailUrl = tUrl
          }
        }

        await supabaseAdmin.from('gallery').insert({
          type,
          url: publicUrl,
          ...(thumbnailUrl ? { thumbnail_url: thumbnailUrl } : {}),
          ...(meta.caption ? { title: meta.caption.slice(0, 120) } : {}),
          display_order: 999,
          published: false,
        })

        results.push({ id: mediaId, success: true })
      } catch (e: unknown) {
        results.push({ id: mediaId, success: false, error: e instanceof Error ? e.message : 'Unknown error' })
      }
    }

    return NextResponse.json({ results })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Import failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
