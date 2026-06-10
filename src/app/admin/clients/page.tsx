import { supabaseAdmin } from '@/lib/supabase'
import ClientsTable from '@/components/admin/ClientsTable'

async function getClients() {
  const { data } = await supabaseAdmin
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-900">Clientes</h1>
        <span className="text-slate-500 text-sm">{clients.length} clientes</span>
      </div>
      <ClientsTable clients={clients} />
    </div>
  )
}
