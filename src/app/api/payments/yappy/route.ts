import { NextRequest, NextResponse } from 'next/server'
import { createYappyPayment, verifyYappyWebhook } from '@/lib/yappy'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const { bookingId, amount, phone } = data

  if (!bookingId || !amount) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skydivepanama.com'

  const result = await createYappyPayment({
    amount,
    orderId: bookingId,
    description: 'Depósito salto tándem - Skydive Panama',
    phone: phone || '',
    successUrl: `${siteUrl}/book/success?id=${bookingId}`,
    failureUrl: `${siteUrl}/book/failed?id=${bookingId}`,
  })

  await supabaseAdmin.from('payments').insert({
    booking_id: bookingId,
    amount,
    method: 'yappy',
    status: 'pending',
  })

  return NextResponse.json(result)
}

// Yappy webhook
export async function PUT(req: NextRequest) {
  const body = await req.json()
  const signature = req.headers.get('x-yappy-signature') || ''

  if (!verifyYappyWebhook(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const { orderId, status, transactionId } = body

  if (status === 'COMPLETED') {
    await supabaseAdmin
      .from('payments')
      .update({ status: 'completed', transaction_id: transactionId })
      .eq('booking_id', orderId)

    await supabaseAdmin
      .from('bookings')
      .update({ deposit_paid: true, status: 'confirmed' })
      .eq('id', orderId)
  }

  return NextResponse.json({ ok: true })
}
