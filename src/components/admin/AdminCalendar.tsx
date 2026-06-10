'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Ban } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import type { BlockedDate } from '@/types'

interface Booking {
  id: string
  client_name: string
  jump_date: string
  jump_time: string
  participants: number
  status: string
}

export default function AdminCalendar({ bookings, blockedDates }: { bookings: Booking[]; blockedDates: BlockedDate[] }) {
  const router = useRouter()
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState<Date | null>(null)

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const isBlocked = (d: Date) => blockedDates.some(b => b.date === format(d, 'yyyy-MM-dd'))
  const dayBookings = (d: Date) => bookings.filter(b => b.jump_date === format(d, 'yyyy-MM-dd'))

  async function toggleBlock(date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const blocked = isBlocked(date)
    await fetch('/api/calendar/block', {
      method: blocked ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr }),
    })
    router.refresh()
  }

  const selectedBookings = selected ? dayBookings(selected) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1))} className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {format(current, 'MMMM yyyy', { locale: es })}
          </h2>
          <button onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1))} className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map(day => {
            const bks = dayBookings(day)
            const blocked = isBlocked(day)
            const sel = selected && isSameDay(day, selected)
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelected(day)}
                className={`relative p-1 rounded-lg min-h-[60px] text-sm transition-colors text-left
                  ${sel ? 'bg-sky-100 border-2 border-sky-500' : 'hover:bg-slate-50 border border-transparent'}
                  ${blocked ? 'bg-red-50' : ''}
                  ${isToday(day) ? 'font-bold' : ''}
                `}
              >
                <span className={`block w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${isToday(day) ? 'bg-sky-500 text-white' : 'text-slate-700'}`}>
                  {format(day, 'd')}
                </span>
                {blocked && <span className="text-red-400 text-xs">🚫 Bloqueado</span>}
                {bks.length > 0 && !blocked && (
                  <span className="bg-sky-500 text-white text-xs rounded-full px-1">{bks.length} reserva{bks.length !== 1 ? 's' : ''}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail */}
      <div className="bg-white rounded-2xl shadow border border-slate-100 p-6">
        {selected ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 capitalize">
                {format(selected, "EEEE d 'de' MMMM", { locale: es })}
              </h3>
              <button
                onClick={() => toggleBlock(selected)}
                title={isBlocked(selected) ? 'Desbloquear' : 'Bloquear fecha'}
                className={`p-2 rounded-lg ${isBlocked(selected) ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'hover:bg-slate-100 text-slate-400'}`}
              >
                <Ban size={16} />
              </button>
            </div>

            {isBlocked(selected) && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">
                Esta fecha está bloqueada. No se aceptan reservas.
              </div>
            )}

            {selectedBookings.length === 0 ? (
              <p className="text-slate-400 text-sm">No hay reservas para este día</p>
            ) : (
              <div className="space-y-3">
                {selectedBookings.map(b => (
                  <div key={b.id} className="border border-slate-100 rounded-xl p-3">
                    <div className="font-semibold text-slate-800 text-sm">{b.client_name}</div>
                    <div className="text-slate-500 text-xs mt-1">{b.jump_time} • {b.participants} pax</div>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-slate-400 py-10">
            <Calendar />
            <p className="mt-3 text-sm">Selecciona un día para ver detalles</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Calendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto opacity-30">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
