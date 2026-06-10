import { supabaseAdmin } from '@/lib/supabase'
import GalleryManager from '@/components/admin/GalleryManager'

async function getGallery() {
  const { data } = await supabaseAdmin
    .from('gallery')
    .select('*')
    .order('display_order')
  return data || []
}

export default async function AdminGalleryPage() {
  const items = await getGallery()

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 mb-8">Gestionar Galería</h1>
      <GalleryManager items={items} />
    </div>
  )
}
