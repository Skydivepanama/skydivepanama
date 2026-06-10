'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { GalleryItem } from '@/types'

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="aspect-square rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.title || 'Skydive Panama'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-sky-300"
            onClick={() => setSelected(null)}
          >
            <X size={32} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.url}
            alt={selected.title || ''}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          {selected.title && (
            <div className="absolute bottom-6 text-white text-center font-semibold text-lg">{selected.title}</div>
          )}
        </div>
      )}
    </>
  )
}
