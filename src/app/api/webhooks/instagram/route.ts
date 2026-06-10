import { NextRequest, NextResponse } from 'next/server'
import { getChatResponse } from '@/lib/claude'
import { supabaseAdmin } from '@/lib/supabase'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN
const IG_TOKEN = process.env.INSTAGRAM_TOKEN

// Webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Incoming messages
export async function POST(req: NextRequest) {
  const body = await req.json()

  const entry = body.entry?.[0]
  const messaging = entry?.messaging?.[0]

  if (!messaging?.message?.text) {
    return NextResponse.json({ ok: true })
  }

  const senderId = messaging.sender.id
  const userText = messaging.message.text

  // Get chat history
  const { data: history } = await supabaseAdmin
    .from('chat_logs')
    .select('message, response')
    .eq('channel', 'instagram')
    .eq('sender_id', senderId)
    .order('created_at', { ascending: false })
    .limit(5)

  const messages = []
  if (history) {
    for (const h of history.reverse()) {
      messages.push({ role: 'user' as const, content: h.message })
      if (h.response) messages.push({ role: 'assistant' as const, content: h.response })
    }
  }
  messages.push({ role: 'user' as const, content: userText })

  const aiResponse = await getChatResponse(messages)

  await supabaseAdmin.from('chat_logs').insert({
    channel: 'instagram',
    sender_id: senderId,
    message: userText,
    response: aiResponse,
  })

  // Send reply via Instagram Messaging API
  await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${IG_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text: aiResponse },
    }),
  })

  return NextResponse.json({ ok: true })
}
