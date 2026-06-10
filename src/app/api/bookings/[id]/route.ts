import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const { error } = await supabaseAdmin
    .from('bookings')
    .update(body)
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Error updating' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabaseAdmin.from('bookings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Error deleting' }, { status: 500 })
  return NextResponse.json({ success: true })
}
