'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import type { GalleryItem } from '@/types'
import InstagramImport from './InstagramImport'

export default function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [type, setType] = useState<'photo' | 'video'>('photo')
  const fileRef = useRef<HTMLInputElement>(null)

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('type', type)
    await fetch('/api/gallery', { method: 'POST', body: form })
    setUploading(false)
    router.refresh()
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    router.refresh()
  }

  async function deleteItem(id: string) {
    if (!confirm('¿Eliminar este elemento?')) return
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      {/* Instagram Import */}
      <InstagramImport />

      {/* Upload */}
      <div className="bg-white rounded-2xl shadow border border-slate-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Subir nuevo archivo</h2>
        <div className="flex items-center gap-4">
          <select value={type} onChange={e => setType(e.target.value as 'photo' | 'video')} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option value="photo">Foto</option>
            <option value="video">Video</option>
          </select>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
          </button>
          <input ref={fileRef} type="file" accept={type === 'photo' ? 'image/*' : 'video/*'} className="hidden" onChange={upload} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className={`relative rounded-xl overflow-hidden border-2 ${item.published ? 'border-slate-100' : 'border-slate-300 opacity-60'} group`}>
            {item.type === 'photo' ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={item.url} alt={item.title || ''} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-slate-900 flex items-center justify-center text-white text-4xl">▶</div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button onClick={() => togglePublish(item.id, item.published)} className="bg-white text-slate-700 rounded-full p-2 hover:bg-sky-50">
                {item.published ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => deleteItem(item.id)} className="bg-white text-red-500 rounded-full p-2 hover:bg-red-50">
                <Trash2 size={16} />
              </button>
            </div>
            {!item.published && <span className="absolute top-2 left-2 bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full">Oculto</span>}
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-4 py-20 text-center text-slate-400">No hay elementos en la galería</div>
        )}
      </div>
    </div>
  )
}
