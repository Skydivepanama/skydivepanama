import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ChatWidget from '@/components/public/ChatWidget'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import { supabase } from '@/lib/supabase'
import type { FAQ, GalleryItem } from '@/types'

const SITE_PHOTOS = [
  'https://skydivepanama.com/wp-content/uploads/2015/10/p11.jpg',
  'https://skydivepanama.com/wp-content/uploads/2016/06/p4.jpg',
  'https://skydivepanama.com/wp-content/uploads/2015/10/p7.jpg',
]

async function getFAQs(): Promise<FAQ[]> {
  const { data } = await supabase.from('faq').select('*').eq('published', true).order('display_order')
  return data || []
}

async function getHeroPhotos(): Promise<GalleryItem[]> {
  const { data } = await supabase.from('gallery').select('*').eq('type', 'photo').eq('published', true).order('display_order').limit(6)
  return data || []
}

export default async function HomePage() {
  const [faqs, photos] = await Promise.all([getFAQs(), getHeroPhotos()])
  const displayPhotos = photos.length > 0 ? photos.map(p => p.url) : SITE_PHOTOS

  return (
    <>
      <Navbar lang="es" />

      {/* Hero */}
      <section className="hero-gradient min-h-screen flex items-center justify-center text-white pt-16 relative overflow-hidden">
        {/* Background photo overlay */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: `url(${SITE_PHOTOS[0]})`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
        <div className="relative text-center px-4 max-w-3xl mx-auto">
          {/* Logo colors badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-8 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Reservas abiertas · Panamá
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Salta desde<br />
            <span style={{color: '#f4a020'}}>el Cielo</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            La experiencia más emocionante de Panamá
          </p>
          <p className="text-lg text-blue-200 mb-10">
            Salto en tándem · Sin experiencia requerida · Desde $50 de depósito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-orange px-8 py-4 text-lg shadow-xl">
              ¡Reserva Ahora!
            </Link>
            <Link href="/gallery" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-colors">
              Ver Galería
            </Link>
          </div>
        </div>
        {/* Orange wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{clipPath: 'ellipse(55% 100% at 50% 100%)'}} />
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { num: '500+', label: 'Saltos realizados' },
            { num: '100%', label: 'Tasa de seguridad' },
            { num: '$50', label: 'Depósito mínimo' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl font-black" style={{color: '#f4a020'}}>{s.num}</div>
              <div className="text-slate-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-4" style={{color: '#1a2744'}}>¿Por qué Skydive Panama?</h2>
          <p className="text-center text-slate-500 mb-14 text-lg">Seguridad, emoción y vistas increíbles</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏅', title: 'Instructores Certificados', desc: 'Equipo con cientos de saltos de experiencia y certificación internacional.' },
              { icon: '🌊', title: 'Vistas Espectaculares', desc: 'Vuela sobre el océano Pacífico y la Ciudad de Panamá con vistas únicas.' },
              { icon: '📱', title: 'Fotos y Videos', desc: 'Capturamos cada momento de tu salto para que puedas compartir la experiencia.' },
            ].map(f => (
              <div key={f.title} className="text-center p-8 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#1a2744'}}>{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="py-20" style={{background: '#1a2744'}}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-white mb-4">Momentos Increíbles</h2>
          <p className="text-center mb-14" style={{color: '#f4a020'}}>Experiencias reales de nuestros saltadores</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayPhotos.map((url, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Skydive Panama ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/gallery" className="btn-orange px-8 py-3">
              Ver Toda la Galería
            </Link>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🪂</div>
          <h2 className="text-4xl font-black mb-4" style={{color: '#1a2744'}}>¿Listo para Saltar?</h2>
          <p className="text-xl text-slate-600 mb-4">Reserva tu lugar con solo <span className="font-bold" style={{color: '#f4a020'}}>$50 USD</span> de depósito</p>
          <p className="text-slate-400 mb-10 text-sm">Pagos con tarjeta, Yappy, ACH o PagoCash</p>
          <Link href="/book" className="btn-orange px-10 py-4 text-xl inline-block shadow-xl">
            Reservar Mi Salto
          </Link>
        </div>
      </section>

      {/* Social / Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-3" style={{color: '#1a2744'}}>Síguenos y Contáctanos</h2>
          <p className="text-slate-500 mb-10">Estamos en Instagram y disponibles por WhatsApp</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://instagram.com/skydivepanama"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
              style={{background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)'}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              @skydivepanama
            </a>
            <a
              href="https://wa.me/50761987991?text=Hola%2C%20quiero%20información%20sobre%20el%20salto%20en%20tándem"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
              style={{background: '#25D366'}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              +507 6198-7991
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-14" style={{color: '#1a2744'}}>Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {faqs.map(faq => (
                <details key={faq.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
                  <summary className="px-6 py-4 font-semibold text-slate-800 cursor-pointer hover:bg-orange-50 list-none flex justify-between items-center">
                    {faq.question_es}
                    <span style={{color: '#f4a020'}}>▼</span>
                  </summary>
                  <div className="px-6 py-4 text-slate-600 border-t border-slate-100 bg-slate-50">
                    {faq.answer_es}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </>
  )
}
