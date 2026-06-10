import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ChatWidget from '@/components/public/ChatWidget'
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
    </>
  )
}
