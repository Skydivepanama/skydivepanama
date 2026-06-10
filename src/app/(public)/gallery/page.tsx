import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ChatWidget from '@/components/public/ChatWidget'
import { supabase } from '@/lib/supabase'
import type { GalleryItem } from '@/types'
import GalleryGrid from '@/components/public/GalleryGrid'

async function getGallery(): Promise<GalleryItem[]> {
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .eq('published', true)
    .order('display_order')
  return data || []
}

export default async function GalleryPage() {
  const items = await getGallery()
  const photos = items.filter(i => i.type === 'photo')
  const videos = items.filter(i => i.type === 'video')

  return (
    <>
      <Navbar lang="es" />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-black text-center text-slate-900 mb-4">Galería</h1>
          <p className="text-center text-slate-500 text-lg mb-14">Momentos reales de nuestros saltadores</p>

          {photos.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Fotos</h2>
              <GalleryGrid items={photos} />
            </>
          )}

          {videos.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map(v => (
                  <div key={v.id} className="rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
                    <video
                      src={v.url}
                      poster={v.thumbnail_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <div className="text-6xl mb-4">🪂</div>
              <p className="text-xl">Próximamente más fotos y videos</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
