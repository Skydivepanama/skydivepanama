import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-white font-bold text-xl mb-3">🪂 Skydive Panama</div>
          <p className="text-sm text-slate-400">La experiencia más emocionante de Panamá. Salta desde el cielo y vive algo único.</p>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Links</div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/gallery" className="hover:text-sky-400 transition-colors">Galería</Link>
            <Link href="/book" className="hover:text-sky-400 transition-colors">Reservar</Link>
            <Link href="/contact" className="hover:text-sky-400 transition-colors">Contacto</Link>
            <Link href="/admin" className="hover:text-sky-400 transition-colors text-slate-500">Admin</Link>
          </div>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Contacto</div>
          <div className="flex flex-col gap-2 text-sm">
            <a href="https://instagram.com/skydivepanama" target="_blank" rel="noopener" className="hover:text-sky-400 transition-colors">
              Instagram: @skydivepanama
            </a>
            <a href="https://wa.me/50700000000" className="hover:text-sky-400 transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Skydive Panama. Todos los derechos reservados.
      </div>
    </footer>
  )
}
