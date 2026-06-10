'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = {
  es: [
    { href: '/', label: 'Inicio' },
    { href: '/gallery', label: 'Galería' },
    { href: '/book', label: 'Reservar' },
    { href: '/contact', label: 'Contacto' },
  ],
  en: [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/book', label: 'Book Now' },
    { href: '/contact', label: 'Contact' },
  ],
}

export default function Navbar({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const [open, setOpen] = useState(false)
  const links = navLinks[lang]

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-sky-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-sky-700 text-xl">
          <span>🪂</span>
          <span>Skydive Panama</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-slate-700 hover:text-sky-600 font-medium transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/book" className="bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-sky-700 transition-colors">
            {lang === 'es' ? '¡Reserva Ahora!' : 'Book Now!'}
          </Link>
          <button
            onClick={() => {}}
            className="text-sm text-slate-500 hover:text-sky-600"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-sky-100 px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-slate-700 font-medium">
              {l.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)} className="bg-sky-600 text-white text-center px-4 py-2 rounded-full font-semibold">
            {lang === 'es' ? '¡Reserva Ahora!' : 'Book Now!'}
          </Link>
        </div>
      )}
    </nav>
  )
}
