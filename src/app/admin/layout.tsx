import Link from 'next/link'
import { Calendar, Users, CreditCard, ImageIcon, LayoutDashboard, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/admin/calendar', icon: <Calendar size={18} />, label: 'Calendario' },
  { href: '/admin/reservations', icon: <Calendar size={18} />, label: 'Reservas' },
  { href: '/admin/clients', icon: <Users size={18} />, label: 'Clientes' },
  { href: '/admin/payments', icon: <CreditCard size={18} />, label: 'Pagos' },
  { href: '/admin/gallery', icon: <ImageIcon size={18} />, label: 'Galería' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="text-lg font-bold text-sky-400">🪂 Skydive Panama</Link>
          <p className="text-xs text-slate-400 mt-1">Panel Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <LogOut size={16} />
            Ver sitio público
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
