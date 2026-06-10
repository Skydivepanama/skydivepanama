import { supabaseAdmin } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

async function getPayments() {
  const { data } = await supabaseAdmin
    .from('payments')
    .select('*, bookings(client_name, jump_date)')
    .order('created_at', { ascending: false })
  return data || []
}

const methodLabels: Record<string, string> = {
  card: '💳 Tarjeta',
  yappy: '📱 Yappy',
  ach: '🏦 ACH',
  pagocash: '💰 PagoCash',
  clave: '🔑 Clave',
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
}

export default async function PaymentsPage() {
  const payments = await getPayments()
  const total = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-900">Pagos</h1>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-sm font-semibold">
          Total cobrado: {formatCurrency(total)}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Fecha Salto</th>
                <th className="px-4 py-3 font-semibold">Monto</th>
                <th className="px-4 py-3 font-semibold">Método</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Transacción</th>
                <th className="px-4 py-3 font-semibold">Fecha Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.bookings?.client_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.bookings?.jump_date || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-slate-600">{methodLabels[p.method] || p.method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[p.status] || 'bg-slate-100 text-slate-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">{p.transaction_id || '—'}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{new Date(p.created_at).toLocaleDateString('es-PA')}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400">No hay pagos aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
