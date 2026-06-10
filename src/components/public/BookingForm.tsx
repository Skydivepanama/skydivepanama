'use client'
// eslint-disable-next-line react-hooks/incompatible-library
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'Teléfono requerido'),
  birthday: z.string().optional(),
  date: z.string().min(1, 'Fecha requerida'),
  time: z.string().min(1, 'Hora requerida'),
  participants: z.number().min(1).max(10),
  amount: z.number().min(50, 'El mínimo es $50'),
  paymentMethod: z.enum(['card', 'yappy', 'ach']),
  // Card fields (only required when method=card)
  cardNumber: z.string().optional(),
  cardExpMonth: z.string().optional(),
  cardExpYear: z.string().optional(),
  cardCVV: z.string().optional(),
  cardHolder: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

export default function BookingForm() {
  const [step, setStep] = useState<'booking' | 'payment' | 'success'>('booking')
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [yappyUrl, setYappyUrl] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { participants: 1, amount: 50, paymentMethod: 'card' },
  })

  const paymentMethod = watch('paymentMethod')
  const amount = watch('amount')

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) {
      alert(result.error || 'Error creando la reserva')
      return
    }
    setBookingId(result.bookingId)

    // Process payment
    const payRes = await fetch(`/api/payments/${data.paymentMethod === 'card' ? 'paguelofacil' : data.paymentMethod}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, bookingId: result.bookingId }),
    })
    const payResult = await payRes.json()

    if (data.paymentMethod === 'yappy' && payResult.paymentUrl) {
      setYappyUrl(payResult.paymentUrl)
      setStep('payment')
    } else if (payResult.success) {
      setStep('success')
    } else {
      alert(payResult.error || 'Error procesando el pago')
    }
  }

  if (step === 'success') {
    return (
      <div className="text-center py-16 bg-green-50 rounded-2xl border border-green-200">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-black text-green-800 mb-2">¡Reserva Confirmada!</h2>
        <p className="text-green-700 mb-4">Tu lugar está reservado. Te enviaremos los detalles por email.</p>
        <p className="text-sm text-slate-500">ID de reserva: {bookingId}</p>
      </div>
    )
  }

  if (step === 'payment' && yappyUrl) {
    return (
      <div className="text-center py-16 bg-sky-50 rounded-2xl border border-sky-200">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-black text-sky-800 mb-4">Completa tu pago con Yappy</h2>
        <p className="text-slate-600 mb-8">Haz clic en el botón para pagar con Yappy</p>
        <a
          href={yappyUrl}
          className="bg-[#00C853] text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-green-600 transition-colors"
        >
          Pagar con Yappy →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 space-y-6">
      {/* Personal info */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Datos Personales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo *</label>
            <input {...register('name')} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input {...register('email')} type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Celular *</label>
            <input {...register('phone')} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400" placeholder="+507 6000-0000" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de cumpleaños</label>
            <input {...register('birthday')} type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400" />
          </div>
        </div>
      </div>

      {/* Jump details */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Detalles del Salto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha *</label>
            <input {...register('date')} type="date" min={minDateStr} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400" />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hora *</label>
            <select {...register('time')} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400">
              <option value="">Seleccionar</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Participantes</label>
            <select {...register('participants', { valueAsNumber: true })} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400">
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Payment amount */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Pago</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Monto a pagar (mínimo $50 USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              min={50}
              step={1}
              className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-sky-400"
            />
          </div>
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          <p className="text-xs text-slate-400 mt-1">El saldo restante se paga el día del salto</p>
        </div>

        {/* Payment method */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { value: 'card', icon: <CreditCard size={20} />, label: 'Tarjeta' },
            { value: 'yappy', icon: <Smartphone size={20} />, label: 'Yappy' },
            { value: 'ach', icon: <Building2 size={20} />, label: 'ACH' },
          ].map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setValue('paymentMethod', m.value as 'card' | 'yappy' | 'ach')}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${paymentMethod === m.value ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 hover:border-sky-300'}`}
            >
              {m.icon}
              <span className="text-sm font-medium">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Card fields */}
        {paymentMethod === 'card' && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre en la tarjeta</label>
              <input {...register('cardHolder')} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número de tarjeta</label>
              <input {...register('cardNumber')} maxLength={19} placeholder="1234 5678 9012 3456" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400 bg-white" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mes</label>
                <input {...register('cardExpMonth')} maxLength={2} placeholder="MM" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Año</label>
                <input {...register('cardExpYear')} maxLength={2} placeholder="AA" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                <input {...register('cardCVV')} maxLength={4} placeholder="123" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400 bg-white" />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'ach' && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-800">
            <p className="font-semibold mb-2">Instrucciones ACH:</p>
            <p>Banco: <strong>Banco General</strong></p>
            <p>Cuenta: <strong>0000-000-000000-0</strong></p>
            <p>A nombre de: <strong>Skydive Panama</strong></p>
            <p className="mt-2 text-blue-600">Envía el comprobante por WhatsApp o Instagram @skydivepanama para confirmar tu reserva.</p>
          </div>
        )}

        {paymentMethod === 'yappy' && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-sm text-green-800">
            <p>Serás redirigido a Yappy para completar el pago de <strong>${amount} USD</strong>.</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-sky-600 text-white font-bold py-4 rounded-full text-lg hover:bg-sky-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <><Loader2 size={20} className="animate-spin" /> Procesando...</>
        ) : (
          `Confirmar Reserva — $${amount || 50} USD`
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        Al reservar aceptas nuestros términos y condiciones. Cancelaciones con 48h de anticipación reciben reembolso completo.
      </p>
    </form>
  )
}
