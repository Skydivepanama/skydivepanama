'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = {
  es: [
    { href: '/', label: 'Inicio' },
    { href: '/gallery', label: 'Galería' },
    { href: '/book', label: 'Reservar' },
    { href: '/terms', label: 'Términos' },
  ],
  en: [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/book', label: 'Book Now' },
    { href: '/terms', label: 'Terms' },
  ],
}

export default function Navbar({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const [open, setOpen] = useState(false)
  const links = navLinks[lang]

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://skydivepanama.com/wp-content/uploads/2021/05/logo-home-logo-image-negro.jpg"
            alt="Skydive Panama"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-slate-700 hover:text-orange-500 font-medium transition-colors text-sm">
              {l.label}
            </Link>
          ))}
          <Link href="/book" className="text-white font-bold px-5 py-2 rounded-full text-sm transition-colors shadow"
            style={{background: '#f4a020'}}
            onMouseOver={e => (e.currentTarget.style.background = '#d4870a')}
            onMouseOut={e => (e.currentTarget.style.background = '#f4a020')}
          >
            {lang === 'es' ? '¡Reserva Ahora!' : 'Book Now!'}
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-slate-700 font-medium">
              {l.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)}
            className="text-white text-center px-4 py-2 rounded-full font-bold"
            style={{background: '#f4a020'}}
          >
            {lang === 'es' ? '¡Reserva Ahora!' : 'Book Now!'}
          </Link>
        </div>
      )}
    </nav>
  )
}
