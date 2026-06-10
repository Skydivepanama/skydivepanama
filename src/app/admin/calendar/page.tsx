import { supabaseAdmin } from '@/lib/supabase'
import AdminCalendar from '@/components/admin/AdminCalendar'

async function getBookings() {
  const { data } = await supabaseAdmin
    .from('bookings')
    .select('id, client_name, jump_date, jump_time, participants, status')
    .not('status', 'eq', 'cancelled')
    .order('jump_date')
  return data || []
}

async function getBlockedDates() {
  const { data } = await supabaseAdmin.from('blocked_dates').select('*')
  return data || []
}

export default async function CalendarPage() {
  const [bookings, blocked] = await Promise.all([getBookings(), getBlockedDates()])

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-8">Calendario de Reservas</h1>
      <AdminCalendar bookings={bookings} blockedDates={blocked} />
    </div>
  )
}
