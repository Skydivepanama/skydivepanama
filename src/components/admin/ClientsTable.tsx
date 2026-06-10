'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Save, X } from 'lucide-react'
import type { Client } from '@/types'

export default function ClientsTable({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Client>>({})
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  async function saveEdit(id: string) {
    await fetch(`/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    setEditing(null)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono..."
          className="w-full max-w-sm border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Celular</th>
              <th className="px-4 py-3 font-semibold">Cumpleaños</th>
              <th className="px-4 py-3 font-semibold">Notas</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                {editing === c.id ? (
                  <>
                    <td className="px-4 py-2"><input defaultValue={c.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className="border rounded px-2 py-1 w-full text-sm" /></td>
                    <td className="px-4 py-2"><input defaultValue={c.email} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} className="border rounded px-2 py-1 w-full text-sm" /></td>
                    <td className="px-4 py-2"><input defaultValue={c.phone} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} className="border rounded px-2 py-1 w-full text-sm" /></td>
                    <td className="px-4 py-2"><input type="date" defaultValue={c.birthday} onChange={e => setEditData(d => ({ ...d, birthday: e.target.value }))} className="border rounded px-2 py-1 text-sm" /></td>
                    <td className="px-4 py-2"><input defaultValue={c.notes} onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))} className="border rounded px-2 py-1 w-full text-sm" /></td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => saveEdit(c.id)} className="text-green-600 hover:text-green-700"><Save size={16} /></button>
                      <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{c.birthday || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{c.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setEditing(c.id); setEditData({}) }} className="text-sky-500 hover:text-sky-700">
                        <Pencil size={15} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-slate-400">No se encontraron clientes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
