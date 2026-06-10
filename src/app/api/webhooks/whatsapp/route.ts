import { NextRequest, NextResponse } from 'next/server'
import { getChatResponse } from '@/lib/claude'
import { supabaseAdmin } from '@/lib/supabase'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_ID = process.env.WHATSAPP_PHONE_ID

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
  const changes = entry?.changes?.[0]
  const message = changes?.value?.messages?.[0]

  if (!message || message.type !== 'text') {
    return NextResponse.json({ ok: true })
  }

  const senderId = message.from
  const senderName = changes.value?.contacts?.[0]?.profile?.name || 'Cliente'
  const userText = message.text.body

  // Get chat history for context (last 5 messages)
  const { data: history } = await supabaseAdmin
    .from('chat_logs')
    .select('message, response')
    .eq('channel', 'whatsapp')
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

  // Log
  await supabaseAdmin.from('chat_logs').insert({
    channel: 'whatsapp',
    sender_id: senderId,
    sender_name: senderName,
    message: userText,
    response: aiResponse,
  })

  // Send reply via WhatsApp API
  await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: senderId,
      type: 'text',
      text: { body: aiResponse },
    }),
  })

  return NextResponse.json({ ok: true })
}
