'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PlusCircle } from 'lucide-react'

type Oferta = { id: string; destino: string; mes: string; precio_base: number; activo: boolean }

export default function AdminOfertasPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])

  useEffect(() => { fetchOfertas() }, [])

  const fetchOfertas = async () => {
    const { data } = await supabase.from('ofertas').select('id, destino, mes, precio_base, activo').order('created_at', { ascending: false })
    if (data) setOfertas(data)
  }

  const toggleActivo = async (oferta: Oferta) => {
    await supabase.from('ofertas').update({ activo: !oferta.activo }).eq('id', oferta.id)
    console.log('estado actualizado')
    setOfertas(ofertas.map(o => o.id === oferta.id ? { ...o, activo: !o.activo } : o))
  }

  const duplicar = async (oferta: Oferta) => {
    const { data: original } = await supabase.from('ofertas').select('*').eq('id', oferta.id).single()
    if (!original) return

    const { data: nueva } = await supabase.from('ofertas').insert({
      destino: original.destino,
      origen: original.origen,
      mes: original.mes,
      precio_base: original.precio_base,
      moneda: original.moneda,
      base: original.base,
      incluye: original.incluye,
      activo: original.activo,
      slug: original.slug + '-copy-' + Date.now(),
    }).select('id').single()

    if (nueva) {
      const { data: hotelesOrigen } = await supabase.from('hoteles').select('*').eq('oferta_id', oferta.id)
      if (hotelesOrigen && hotelesOrigen.length > 0) {
        await supabase.from('hoteles').insert(
          hotelesOrigen.map(h => ({ oferta_id: nueva.id, nombre: h.nombre, precio: h.precio, orden: h.orden }))
        )
      }
    }

    console.log('oferta duplicada')
    fetchOfertas()
  }

  const formatPrice = (n: number) => 'USD ' + n.toLocaleString('en-US')
  const btnOutline = 'border border-[#072E40] text-[#072E40] px-3 py-1.5 rounded-lg hover:bg-[#072E40] hover:text-white text-xs transition'
  const btnGhost = 'text-gray-500 px-3 py-1.5 hover:underline text-xs transition'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Ofertas</h1>
          <p className="text-gray-500 text-sm mt-1">Gestioná todas tus ofertas activas</p>
        </div>
        <Link
          href="/admin/ofertas/nueva"
          className="flex items-center gap-2 bg-[#11BCB3] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          <PlusCircle size={16} />
          Nueva oferta
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b">
              <th className="pb-3 pr-4 font-medium">Destino</th>
              <th className="pb-3 pr-4 font-medium">Mes</th>
              <th className="pb-3 pr-4 font-medium">Precio</th>
              <th className="pb-3 pr-4 font-medium">Estado</th>
              <th className="pb-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ofertas.map(oferta => (
              <tr key={oferta.id} className="hover:bg-gray-50 transition">
                <td className="py-4 pr-4 font-medium capitalize">{oferta.destino}</td>
                <td className="py-4 pr-4 text-gray-500">{oferta.mes}</td>
                <td className="py-4 pr-4 text-gray-500">{formatPrice(oferta.precio_base)}</td>
                <td className="py-4 pr-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${oferta.activo ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>
                    {oferta.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2 items-center justify-end">
                    <button type="button" className={btnGhost} onClick={() => toggleActivo(oferta)}>
                      {oferta.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <Link href={`/admin/ofertas/${oferta.id}`} className={btnOutline}>Editar</Link>
                    <button type="button" className="bg-[#11BCB3] text-white px-3 py-1.5 rounded-lg hover:opacity-90 text-xs font-medium transition" onClick={() => duplicar(oferta)}>Duplicar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ofertas.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No hay ofertas aún</p>
        )}
      </div>
    </div>
  )
}
