import { NextRequest, NextResponse } from 'next/server'
import { getChatResponse } from '@/lib/claude'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
  }

  const response = await getChatResponse(messages)

  // Log conversation
  const last = messages[messages.length - 1]
  await supabaseAdmin.from('chat_logs').insert({
    channel: 'web',
    message: last?.content || '',
    response,
  })

  return NextResponse.json({ response })
}
