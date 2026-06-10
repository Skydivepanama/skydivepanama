import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="text-white py-12 mt-auto" style={{background: '#1a2744'}}>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-dark.jpg"
            alt="Skydive Panama"
            className="h-12 mb-3"
          />
          <p className="text-sm" style={{color: '#94a3b8'}}>La experiencia más emocionante de Panamá. Salta desde el cielo y vive algo único.</p>
        </div>
        <div>
          <div className="font-semibold mb-3" style={{color: '#f4a020'}}>Links</div>
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/gallery" className="hover:text-white transition-colors">Galería</Link>
            <Link href="/book" className="hover:text-white transition-colors">Reservar</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <Link href="/admin" className="hover:text-white transition-colors text-slate-500">Admin</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-3" style={{color: '#f4a020'}}>Contacto</div>
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            <a href="https://instagram.com/skydivepanama" target="_blank" rel="noopener" className="hover:text-white transition-colors">
              Instagram: @skydivepanama
            </a>
            <a href="https://wa.me/50700000000" className="hover:text-white transition-colors">
              WhatsApp
            </a>
            <a href="mailto:info@skydivepanama.net" className="hover:text-white transition-colors">
              info@skydivepanama.net
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 text-center text-xs" style={{borderTop: '1px solid #243258', color: '#64748b'}}>
        © {new Date().getFullYear()} Skydive Panama. Todos los derechos reservados.
      </div>
    </footer>
  )
}
