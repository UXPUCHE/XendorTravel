import { supabase } from '@/lib/supabase'
import { OfertaBuilder } from '../_builder'

export default async function EditarOfertaPage({ params }: any) {
  const { id } = await params

  const { data: oferta } = await supabase
    .from('ofertas')
    .select('*')
    .eq('id', id)
    .single()

  const { data: hoteles } = await supabase
    .from('hoteles')
    .select('*')
    .eq('oferta_id', id)
    .order('orden', { ascending: true })

  const { data: vuelos } = await supabase
    .from('vuelos')
    .select('*')
    .eq('oferta_id', id)

  if (!oferta) return <div className="p-8 text-gray-500">Oferta no encontrada</div>

  const toVuelo = (v: Record<string, string> | null | undefined) => v ? {
    origen: v.origen ?? '',
    destino: v.destino ?? '',
    salida: v.salida ?? '',
    llegada: v.llegada ?? '',
    escala: v.escala ?? '',
    duracion: v.duracion ?? '',
    aerolinea: v.aerolinea ?? '',
    equipaje: v.equipaje ?? '',
  } : undefined

  return (
    <OfertaBuilder
      editingId={id}
      initialForm={{
        destino: oferta.destino,
        origen: oferta.origen,
        mes: oferta.mes,
        precio_base: String(oferta.precio_base),
        descripcion_corta: oferta.descripcion_corta ?? '',
        fecha_salida: oferta.fecha_salida ?? '',
        incluye: Array.isArray(oferta.incluye) ? oferta.incluye : [],
        features: Array.isArray(oferta.features)
          ? oferta.features.map((f: { icon: string; title: string; subtitle?: string }) => ({
              id: crypto.randomUUID(),
              icon: f.icon ?? 'check',
              title: f.title ?? '',
              subtitle: f.subtitle ?? '',
            }))
          : [],
      }}
      initialHoteles={hoteles?.map(h => ({
        id: h.id,
        nombre: h.nombre,
        precio: String(h.precio),
        principal: !!h.principal,
        badge: h.badge ?? '',
        imagen: h.imagen ?? '',
        estrellas: h.estrellas ? String(h.estrellas) : '',
        regimen: h.regimen ?? '',
        noches: h.noches ? String(h.noches) : '',
      })) ?? []}
      initialIda={toVuelo(vuelos?.find(v => v.tipo === 'ida'))}
      initialVuelta={toVuelo(vuelos?.find(v => v.tipo === 'vuelta'))}
    />
  )
}
