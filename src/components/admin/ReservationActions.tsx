'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Status = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export default function ReservationActions({ bookingId, currentStatus }: { bookingId: string; currentStatus: Status }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(status: Status) {
    setLoading(true)
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(false)
    router.refresh()
  }

  const actions: { label: string; status: Status; color: string }[] = [
    { label: 'Confirmar', status: 'confirmed' as Status, color: 'text-green-600 hover:text-green-700' },
    { label: 'Completar', status: 'completed' as Status, color: 'text-blue-600 hover:text-blue-700' },
    { label: 'Cancelar', status: 'cancelled' as Status, color: 'text-red-500 hover:text-red-600' },
  ].filter(a => a.status !== currentStatus)

  return (
    <div className="flex gap-2">
      {actions.map(a => (
        <button
          key={a.status}
          onClick={() => updateStatus(a.status)}
          disabled={loading}
          className={`text-xs font-semibold ${a.color} disabled:opacity-50`}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
