import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ChatWidget from '@/components/public/ChatWidget'
import { supabase } from '@/lib/supabase'
import type { FAQ, GalleryItem } from '@/types'

async function getFAQs(): Promise<FAQ[]> {
  const { data } = await supabase
    .from('faq')
    .select('*')
    .eq('published', true)
    .order('display_order')
  return data || []
}

async function getHeroPhotos(): Promise<GalleryItem[]> {
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .eq('type', 'photo')
    .eq('published', true)
    .order('display_order')
    .limit(3)
  return data || []
}

export default async function HomePage() {
  const [faqs, photos] = await Promise.all([getFAQs(), getHeroPhotos()])

  return (
    <>
      <Navbar lang="es" />

      {/* Hero */}
      <section className="hero-gradient min-h-screen flex items-center justify-center text-white pt-16">
        <div className="text-center px-4 max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🪂</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Salta desde el Cielo
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-sky-100">
            La experiencia más emocionante de Panamá
          </p>
          <p className="text-lg text-sky-200 mb-10">
            Salto en tándem • Sin experiencia requerida • Desde $50 de depósito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="bg-white text-sky-700 font-bold px-8 py-4 rounded-full text-lg hover:bg-sky-50 transition-colors shadow-lg">
              ¡Reserva Ahora!
            </Link>
            <Link href="/gallery" className="border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-colors">
              Ver Galería
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-4">¿Por qué Skydive Panama?</h2>
          <p className="text-center text-slate-500 mb-14 text-lg">Seguridad, emoción y vistas increíbles</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏅', title: 'Instructores Certificados', desc: 'Nuestro equipo tiene cientos de saltos de experiencia y certificación internacional.' },
              { icon: '🌊', title: 'Vistas Espectaculares', desc: 'Vuela sobre el océano Pacífico y la Ciudad de Panamá con vistas que no olvidarás.' },
              { icon: '📱', title: 'Fotos y Videos', desc: 'Capturamos cada momento de tu salto para que puedas compartir la experiencia.' },
            ].map(f => (
              <div key={f.title} className="text-center p-8 rounded-2xl bg-sky-50 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      {photos.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-slate-900 mb-14">Momentos Increíbles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {photos.map(p => (
                <div key={p.id} className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.title || 'Skydive Panama'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/gallery" className="bg-sky-600 text-white font-bold px-8 py-3 rounded-full hover:bg-sky-700 transition-colors">
                Ver Toda la Galería
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Booking CTA */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4">¿Listo para Saltar?</h2>
          <p className="text-xl text-sky-100 mb-4">Reserva tu lugar con solo $50 USD de depósito</p>
          <p className="text-sky-200 mb-10">Pagos con tarjeta, Yappy, ACH o PagoCash</p>
          <Link href="/book" className="bg-white text-sky-700 font-bold px-10 py-4 rounded-full text-xl hover:bg-sky-50 transition-colors shadow-xl">
            Reservar Mi Salto
          </Link>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-slate-900 mb-14">Preguntas Frecuentes</h2>
            <div className="space-y-4">
              {faqs.map(faq => (
                <details key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden group">
                  <summary className="px-6 py-4 font-semibold text-slate-800 cursor-pointer hover:bg-sky-50 list-none flex justify-between items-center">
                    {faq.question_es}
                    <span className="text-sky-500">▼</span>
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
