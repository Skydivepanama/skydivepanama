import { supabaseAdmin } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

async function getStats() {
  const [bookings, clients, payments] = await Promise.all([
    supabaseAdmin.from('bookings').select('id, status', { count: 'exact' }),
    supabaseAdmin.from('clients').select('id', { count: 'exact' }),
    supabaseAdmin.from('payments').select('amount').eq('status', 'completed'),
  ])

  const totalRevenue = payments.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
  const pending = bookings.data?.filter(b => b.status === 'pending').length || 0
  const confirmed = bookings.data?.filter(b => b.status === 'confirmed').length || 0

  return {
    totalBookings: bookings.count || 0,
    totalClients: clients.count || 0,
    totalRevenue,
    pending,
    confirmed,
  }
}

async function getRecentBookings() {
  const { data } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentBookings()])

  const cards = [
    { label: 'Reservas totales', value: stats.totalBookings, color: 'bg-sky-500' },
    { label: 'Clientes', value: stats.totalClients, color: 'bg-indigo-500' },
    { label: 'Ingresos (pagados)', value: formatCurrency(stats.totalRevenue), color: 'bg-emerald-500' },
    { label: 'Pendientes', value: stats.pending, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map(c => (
          <div key={c.label} className={`${c.color} text-white rounded-2xl p-6 shadow-md`}>
            <p className="text-sm font-medium opacity-80 mb-1">{c.label}</p>
            <p className="text-3xl font-black">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Reservas Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="pb-3 font-semibold">Cliente</th>
                <th className="pb-3 font-semibold">Fecha</th>
                <th className="pb-3 font-semibold">Hora</th>
                <th className="pb-3 font-semibold">Estado</th>
                <th className="pb-3 font-semibold">Pagado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-900">{b.client_name}</td>
                  <td className="py-3 text-slate-600">{b.jump_date}</td>
                  <td className="py-3 text-slate-600">{b.jump_time}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{formatCurrency(b.total_paid)}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">No hay reservas aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
