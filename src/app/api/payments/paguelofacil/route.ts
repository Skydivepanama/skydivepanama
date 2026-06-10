import { NextRequest, NextResponse } from 'next/server'
import { chargeCard } from '@/lib/paguelofacil'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const { bookingId, amount, email, phone, cardNumber, cardExpMonth, cardExpYear, cardCVV, cardHolder } = data

  if (!bookingId || !amount || !cardNumber) {
    return NextResponse.json({ error: 'Faltan datos de pago' }, { status: 400 })
  }

  const result = await chargeCard({
    amount,
    description: `Depósito salto tándem - Skydive Panama`,
    cardNumber,
    cardExpMonth,
    cardExpYear,
    cardCVV,
    cardHolder,
    email,
    phone,
  })

  // Save payment record
  await supabaseAdmin.from('payments').insert({
    booking_id: bookingId,
    amount,
    method: 'card',
    status: result.success ? 'completed' : 'failed',
    transaction_id: result.transactionId,
    provider_response: result.raw,
  })

  if (result.success) {
    await supabaseAdmin
      .from('bookings')
      .update({ deposit_paid: true, total_paid: amount, status: 'confirmed' })
      .eq('id', bookingId)
  }

  return NextResponse.json(result)
}
