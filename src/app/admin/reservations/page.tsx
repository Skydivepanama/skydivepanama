import { supabaseAdmin } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import ReservationActions from '@/components/admin/ReservationActions'

async function getBookings() {
  const { data } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('jump_date', { ascending: true })
  return data || []
}

export default async function ReservationsPage() {
  const bookings = await getBookings()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-900">Reservas</h1>
        <span className="text-slate-500 text-sm">{bookings.length} reservas total</span>
      </div>

      <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Hora</th>
                <th className="px-4 py-3 font-semibold">Pax</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Pagado</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{b.client_name}</td>
                  <td className="px-4 py-3 text-slate-600">{b.client_email || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{b.client_phone || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{b.jump_date}</td>
                  <td className="px-4 py-3 text-slate-600">{b.jump_time}</td>
                  <td className="px-4 py-3 text-center">{b.participants}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(b.total_paid)}</td>
                  <td className="px-4 py-3">
                    <ReservationActions bookingId={b.id} currentStatus={b.status} />
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400">No hay reservas aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
