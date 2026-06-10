import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const data = await req.json()

  const { name, email, phone, birthday, date, time, participants, paymentMethod } = data

  if (!name || !date || !time) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  // Upsert client
  let clientId: string | null = null
  if (email) {
    const { data: existing } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      clientId = existing.id
    } else {
      const { data: newClient } = await supabaseAdmin
        .from('clients')
        .insert({ name, email, phone, birthday: birthday || null })
        .select('id')
        .single()
      clientId = newClient?.id || null
    }
  }

  // Create booking
  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      client_id: clientId,
      client_name: name,
      client_email: email,
      client_phone: phone,
      jump_date: date,
      jump_time: time,
      participants: participants || 1,
      status: paymentMethod === 'ach' ? 'pending' : 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Error creando la reserva' }, { status: 500 })
  }

  return NextResponse.json({ bookingId: booking.id, success: true })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  let query = supabaseAdmin
    .from('bookings')
    .select('*')
    .order('jump_date', { ascending: true })

  if (date) {
    query = query.eq('jump_date', date)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: 'Error' }, { status: 500 })
  return NextResponse.json(data)
}
