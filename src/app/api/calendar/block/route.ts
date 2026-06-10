import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { date, reason } = await req.json()
  const { error } = await supabaseAdmin.from('blocked_dates').insert({ date, reason })
  if (error) return NextResponse.json({ error: 'Error blocking date' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { date } = await req.json()
  const { error } = await supabaseAdmin.from('blocked_dates').delete().eq('date', date)
  if (error) return NextResponse.json({ error: 'Error unblocking date' }, { status: 500 })
  return NextResponse.json({ success: true })
}
