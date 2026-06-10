'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Images, Loader2, Download, CheckSquare, Square } from 'lucide-react'

interface IgMedia {
  id: string
  media_type: 'IMAGE' | 'VIDEO'
  media_url: string
  thumbnail_url?: string
  caption?: string
  timestamp: string
}

export default function InstagramImport() {
  const router = useRouter()
  const [media, setMedia] = useState<IgMedia[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function loadMedia() {
    setLoading(true)
    setError('')
    setDone(false)
    setSelected(new Set())
    try {
      const res = await fetch('/api/gallery/instagram')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMedia(data.items)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error loading Instagram media')
    } finally {
      setLoading(false)
    }
  }

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === media.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(media.map(m => m.id)))
    }
  }

  async function importSelected() {
    if (!selected.size) return
    setImporting(true)
    setError('')
    try {
      const res = await fetch('/api/gallery/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const failed = data.results?.filter((r: { success: boolean }) => !r.success)
      if (failed?.length) {
        setError(`${failed.length} item(s) failed to import.`)
      } else {
        setDone(true)
        setMedia([])
        setSelected(new Set())
        router.refresh()
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-slate-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Images size={20} className="text-pink-500" />
          Importar desde Instagram
        </h2>
        <button
          onClick={loadMedia}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Images size={16} />}
          {loading ? 'Cargando...' : media.length ? 'Recargar' : 'Cargar fotos de Instagram'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {done && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
          ¡Importación completa! Las fotos están en la galería como ocultas — publícalas cuando quieras.
        </div>
      )}

      {media.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <button onClick={toggleAll} className="text-sm text-sky-600 hover:underline flex items-center gap-1">
              {selected.size === media.length ? <CheckSquare size={15} /> : <Square size={15} />}
              {selected.size === media.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </button>
            <span className="text-sm text-slate-500">{selected.size} de {media.length} seleccionadas</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mb-4">
            {media.map(item => {
              const sel = selected.has(item.id)
              const thumb = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${sel ? 'border-pink-500 ring-2 ring-pink-300' : 'border-transparent'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={item.caption ?? ''} className="w-full h-full object-cover" />
                  {item.media_type === 'VIDEO' && (
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">▶</span>
                  )}
                  {sel && (
                    <span className="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-0.5">
                      <CheckSquare size={12} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={importSelected}
            disabled={!selected.size || importing}
            className="flex items-center gap-2 bg-sky-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 transition-colors"
          >
            {importing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {importing ? 'Importando...' : `Importar ${selected.size || ''} seleccionadas`}
          </button>
        </>
      )}
    </div>
  )
}
