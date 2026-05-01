'use client'

import { useEffect, useState } from 'react'
import { PlusCircle, Pencil, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Oferta = {
  id: string
  destino: string
  mes: string
  precio_base: number
  activo: boolean
  expires_at: string | null
  created_at: string
}

export default function AdminHome() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [userName, setUserName] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email || ''
      const name = data.user?.user_metadata?.name || email.split('@')[0] || 'Admin'
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    })

    supabase
      .from('ofertas')
      .select('id, destino, mes, precio_base, activo, expires_at, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOfertas(data)
      })
  }, [])

  const now = new Date()

  const activas = ofertas.filter(o => o.activo && (!o.expires_at || new Date(o.expires_at) > now))
  const expiradas = ofertas.filter(o => o.expires_at && new Date(o.expires_at) <= now)
  const proximasAVencer = ofertas.filter(o => {
    if (!o.expires_at || !o.activo) return false
    const diff = (new Date(o.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  })
  const ultimas = ofertas.slice(0, 5)

  const stats = [
    { label: 'Ofertas activas', value: activas.length, icon: CheckCircle, color: 'text-[#11BCB3]', bg: 'bg-[#11BCB3]/10' },
    { label: 'Vencen en 7 días', value: proximasAVencer.length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Expiradas', value: expiradas.length, icon: XCircle, color: 'text-red-400', bg: 'bg-red-50' },
    { label: 'Total', value: ofertas.length, icon: TrendingUp, color: 'text-[#072E40]', bg: 'bg-gray-100' },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Hola, {userName} 👋</h1>
        <p className="text-gray-500 mt-1 text-sm">Resumen de tus ofertas publicadas</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#072E40]">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ACCIONES RAPIDAS */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/admin/ofertas/nueva"
          className="bg-gradient-to-r from-[#11BCB3] to-[#072E40] text-white rounded-2xl px-6 py-5 flex items-center gap-4 hover:opacity-90 transition"
        >
          <PlusCircle size={24} />
          <div>
            <p className="font-bold text-base">Crear nueva oferta</p>
            <p className="text-white/70 text-sm mt-0.5">Publicá un nuevo destino</p>
          </div>
        </Link>
        <Link
          href="/admin/ofertas"
          className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 shadow-sm hover:shadow-md transition"
        >
          <Pencil size={24} className="text-[#11BCB3]" />
          <div>
            <p className="font-bold text-base text-[#072E40]">Gestionar ofertas</p>
            <p className="text-gray-400 text-sm mt-0.5">Editá, activá o duplicá</p>
          </div>
        </Link>
      </div>

      {/* ULTIMAS OFERTAS */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg text-[#072E40] mb-4">Últimas ofertas</h2>
        {ultimas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No hay ofertas todavía</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b">
                <th className="pb-3 font-medium">Destino</th>
                <th className="pb-3 font-medium">Mes</th>
                <th className="pb-3 font-medium">Precio</th>
                <th className="pb-3 font-medium">Vence</th>
                <th className="pb-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ultimas.map(o => {
                const expirada = o.expires_at && new Date(o.expires_at) <= now
                const proximaAVencer = o.expires_at && !expirada &&
                  (new Date(o.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7

                return (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 font-medium capitalize">{o.destino}</td>
                    <td className="py-3 text-gray-500">{o.mes}</td>
                    <td className="py-3 text-gray-500">USD {Number(o.precio_base).toLocaleString('en-US')}</td>
                    <td className="py-3 text-gray-500 text-xs">
                      {o.expires_at
                        ? new Date(o.expires_at).toLocaleDateString('es-AR')
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3">
                      {expirada ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-600 border border-red-200">Expirada</span>
                      ) : proximaAVencer ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">Vence pronto</span>
                      ) : o.activo ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">Activa</span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-500 border border-gray-300">Inactiva</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
