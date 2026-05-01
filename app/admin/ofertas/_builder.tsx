'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash } from 'lucide-react'
import { ImageInput } from '@/components/ui/ImageInput'
import { AIRLINES } from '@/lib/airlines'

export type Hotel = {
  id: string
  nombre: string
  precio: string
  principal: boolean
  badge: string
  imagen: string
  estrellas: string
  regimen: string
  noches: string
}

type Feature = { id: string; icon: string; title: string; subtitle: string }

type FormState = {
  destino: string
  origen: string
  mes: string
  precio_base: string
  descripcion_corta: string
  fecha_salida: string
  expires_at: string
  imagen_hero: string
  cuotas: string
  incluye: string[]
  features: Feature[]
}

const EMPTY_FORM: FormState = {
  destino: '', origen: '', mes: '', precio_base: '',
  descripcion_corta: '', fecha_salida: '', expires_at: '',
  imagen_hero: '', cuotas: '', incluye: [], features: [],
}

const ICON_OPTIONS = ['plane', 'car', 'hotel', 'shield', 'check'] as const

const ICON_LABELS: Record<string, string> = {
  plane: '✈ Vuelo',
  car: '🚗 Traslado',
  hotel: '🏨 Hotel',
  shield: '🛡 Seguro',
  check: '✓ Genérico',
}

type VueloState = {
  origen: string
  destino: string
  salida: string
  llegada: string
  escala: string
  duracion: string
  aerolinea: string
  equipaje: string
}

const EMPTY_VUELO: VueloState = {
  origen: '', destino: '', salida: '', llegada: '', escala: '', duracion: '', aerolinea: '', equipaje: '',
}

const BADGE_OPTIONS = ['', 'Más vendido', 'Mejor opción', 'Promo']
const REGIMEN_OPTIONS = ['', 'All inclusive', 'Desayuno', 'Media pensión', 'Solo alojamiento']
const EMPTY_HOTEL: Omit<Hotel, 'id'> = {
  nombre: '', precio: '', principal: false, badge: '', imagen: '', estrellas: '', regimen: '', noches: '',
}

const inputCls = 'bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#11BCB3] text-sm transition-all duration-200'
const labelCls = 'text-xs uppercase tracking-wide text-gray-500 mb-1 block font-medium'

function StarRating({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(String(n))}
          className={`text-lg leading-none transition ${Number(value) >= n ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function PrincipalToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
        active
          ? 'bg-[#11BCB3] text-white border-[#11BCB3]'
          : 'bg-white text-gray-400 border-gray-200 hover:border-[#11BCB3] hover:text-[#11BCB3]'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-gray-300'}`} />
      {active ? 'Principal' : 'Marcar principal'}
    </button>
  )
}

function SortableHotelCard({
  hotel,
  onUpdate,
  onRemove,
}: {
  hotel: Hotel
  onUpdate: (id: string, field: keyof Hotel, value: string | boolean) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: hotel.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border-2 bg-white shadow-sm transition-shadow ${
        isDragging ? 'opacity-60 scale-[1.02] shadow-xl' :
        hotel.principal ? 'border-[#11BCB3]' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Image preview */}
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center text-3xl text-gray-300">
          {hotel.imagen
            ? <img src={hotel.imagen} className="w-full h-full object-cover" alt="" />
            : '🏨'
          }
        </div>

        {/* Fields */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Row 1: nombre + precio */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Nombre *</label>
              <input
                className={inputCls}
                placeholder="Ej: Hotel Riu Cancún"
                value={hotel.nombre}
                onChange={e => onUpdate(hotel.id, 'nombre', e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Precio USD *</label>
              <input
                className={inputCls}
                placeholder="1200"
                type="number"
                value={hotel.precio}
                onChange={e => onUpdate(hotel.id, 'precio', e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: imagen */}
          <div>
            <label className={labelCls}>Imagen</label>
            <ImageInput value={hotel.imagen} onChange={url => onUpdate(hotel.id, 'imagen', url)} />
          </div>

          {/* Row 3: regimen + noches + badge */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={labelCls}>Régimen</label>
              <select
                className={inputCls}
                value={hotel.regimen}
                onChange={e => onUpdate(hotel.id, 'regimen', e.target.value)}
              >
                {REGIMEN_OPTIONS.map(o => <option key={o} value={o}>{o || 'Sin régimen'}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Noches</label>
              <input
                className={inputCls}
                placeholder="7"
                type="number"
                value={hotel.noches}
                onChange={e => onUpdate(hotel.id, 'noches', e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Badge</label>
              <select
                className={inputCls}
                value={hotel.badge}
                onChange={e => onUpdate(hotel.id, 'badge', e.target.value)}
              >
                {BADGE_OPTIONS.map(o => <option key={o} value={o}>{o || 'Sin badge'}</option>)}
              </select>
            </div>
          </div>

          {/* Row 4: estrellas + principal toggle */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div>
              <label className={labelCls}>Estrellas</label>
              <StarRating value={hotel.estrellas} onChange={v => onUpdate(hotel.id, 'estrellas', v)} />
            </div>
            <PrincipalToggle active={hotel.principal} onClick={() => onUpdate(hotel.id, 'principal', true)} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 shrink-0 pt-1">
          <button
            type="button"
            className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={20} />
          </button>
          <button
            type="button"
            onClick={() => onRemove(hotel.id)}
            className="text-gray-300 hover:text-red-500 transition"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* Principal banner */}
      {hotel.principal && (
        <div className="bg-[#11BCB3]/10 border-t border-[#11BCB3]/20 px-4 py-1.5 rounded-b-2xl">
          <p className="text-xs text-[#11BCB3] font-semibold">⭐ Hotel principal — aparece destacado en la landing</p>
        </div>
      )}
    </div>
  )
}

function PreviewOferta({ form, hoteles }: { form: FormState; hoteles: Hotel[] }) {
  const principal = hoteles.find(h => h.principal) ?? hoteles[0]
  const resto = hoteles.filter(h => h.id !== principal?.id)

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-6 font-medium">Vista previa de la oferta</p>

      <div className="mb-6 pb-6 border-b">
        <h2 className="text-3xl font-bold capitalize">{form.destino || 'Destino'}</h2>
        <p className="text-2xl text-green-600 font-semibold mt-1">
          Desde USD {Number(form.precio_base || 0).toLocaleString('en-US')}
        </p>
        <p className="text-gray-500 mt-1">{form.mes || 'Mes'}</p>
      </div>

      {principal ? (
        <div className="border-2 border-[#11BCB3] rounded-xl overflow-hidden mb-4">
          {principal.imagen && (
            <img src={principal.imagen} className="w-full h-36 object-cover" alt="" />
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900">{principal.nombre || 'Hotel principal'}</p>
                {principal.estrellas && (
                  <p className="text-yellow-400 text-xs mt-0.5">{'★'.repeat(Number(principal.estrellas))}</p>
                )}
                {principal.regimen && (
                  <p className="text-xs text-gray-500 mt-0.5">{principal.regimen}{principal.noches ? ` · ${principal.noches} noches` : ''}</p>
                )}
              </div>
              <p className="text-[#072E40] font-extrabold text-lg shrink-0">
                {principal.precio ? `USD ${Number(principal.precio).toLocaleString('en-US')}` : '—'}
              </p>
            </div>
            {principal.badge && (
              <span className="mt-2 inline-block text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{principal.badge}</span>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-8">Agregá hoteles para ver la preview</p>
      )}

      {resto.length > 0 && (
        <div className="border rounded-xl p-4">
          <p className="text-sm font-semibold mb-3 text-gray-600">Otras opciones ({resto.length})</p>
          <ul className="divide-y">
            {resto.map(h => (
              <li key={h.id} className="flex items-center gap-3 py-3">
                {h.imagen
                  ? <img src={h.imagen} className="w-10 h-10 rounded-lg object-cover shrink-0" alt="" />
                  : <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-lg">🏨</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{h.nombre || 'Hotel'}</p>
                  <p className="text-xs text-gray-400">{h.regimen || ''}{h.noches ? ` · ${h.noches}n` : ''}</p>
                </div>
                <p className="text-sm font-bold text-[#072E40] shrink-0">
                  {h.precio ? `USD ${Number(h.precio).toLocaleString('en-US')}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

type Props = {
  editingId?: string
  initialForm?: FormState
  initialHoteles?: Hotel[]
  initialIda?: VueloState
  initialVuelta?: VueloState
}

export function OfertaBuilder({ editingId, initialForm, initialHoteles, initialIda, initialVuelta }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(initialForm ?? EMPTY_FORM)
  const [hoteles, setHoteles] = useState<Hotel[]>(initialHoteles ?? [])
  const [ida, setIda] = useState<VueloState>(initialIda ?? EMPTY_VUELO)
  const [vuelta, setVuelta] = useState<VueloState>(initialVuelta ?? EMPTY_VUELO)

  const sensors = useSensors(useSensor(PointerSensor))

  const addHotel = () => setHoteles(prev => [...prev, { id: crypto.randomUUID(), ...EMPTY_HOTEL }])

  const updateHotel = (id: string, field: keyof Hotel, value: string | boolean) => {
    setHoteles(prev => prev.map(h => {
      if (field === 'principal') return { ...h, principal: h.id === id }
      return h.id === id ? { ...h, [field]: value } : h
    }))
  }

  const removeHotel = (id: string) => setHoteles(prev => prev.filter(h => h.id !== id))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = hoteles.findIndex(h => h.id === active.id)
      const newIndex = hoteles.findIndex(h => h.id === over.id)
      setHoteles(prev => arrayMove(prev, oldIndex, newIndex))
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const hotelRows = (ofertaId: string) => hoteles.map((h, i) => ({
      oferta_id: ofertaId,
      nombre: h.nombre,
      precio: Number(h.precio),
      orden: i,
      principal: h.principal,
      badge: h.badge || null,
      imagen: h.imagen || null,
      estrellas: h.estrellas ? Number(h.estrellas) : null,
      regimen: h.regimen || null,
      noches: h.noches ? Number(h.noches) : null,
    }))

    const ofertaPayload = (base: Record<string, unknown>) => ({
      ...base,
      descripcion_corta: form.descripcion_corta || null,
      fecha_salida: form.fecha_salida || null,
      expires_at: form.expires_at || null,
      imagen_hero: form.imagen_hero || null,
      cuotas: form.cuotas || null,
      incluye: form.incluye.length > 0 ? form.incluye : null,
      features: form.features.length > 0
        ? form.features.map(({ icon, title, subtitle }) => ({ icon, title, subtitle: subtitle || undefined }))
        : null,
    })

    const vueloPayload = (v: VueloState) => ({
      origen: v.origen || null,
      destino: v.destino || null,
      salida: v.salida || null,
      llegada: v.llegada || null,
      escala: v.escala || null,
      duracion: v.duracion || null,
      aerolinea: v.aerolinea || null,
      equipaje: v.equipaje || null,
    })

    const vueloRows = (ofertaId: string) => {
      const rows = []
      if (ida.origen || ida.destino) rows.push({ ...vueloPayload(ida), oferta_id: ofertaId, tipo: 'ida' })
      if (vuelta.origen || vuelta.destino) rows.push({ ...vueloPayload(vuelta), oferta_id: ofertaId, tipo: 'vuelta' })
      return rows
    }

    if (editingId) {
      await supabase.from('ofertas').update(ofertaPayload({
        destino: form.destino,
        origen: form.origen,
        mes: form.mes,
        precio_base: Number(form.precio_base),
      })).eq('id', editingId)

      await supabase.from('hoteles').delete().eq('oferta_id', editingId)
      if (hoteles.length > 0) await supabase.from('hoteles').insert(hotelRows(editingId))

      await supabase.from('vuelos').delete().eq('oferta_id', editingId)
      const vr = vueloRows(editingId)
      if (vr.length > 0) await supabase.from('vuelos').insert(vr)
    } else {
      const { data } = await supabase.from('ofertas').insert(ofertaPayload({
        destino: form.destino,
        origen: form.origen,
        mes: form.mes,
        precio_base: Number(form.precio_base),
        slug: form.destino.toLowerCase().replace(/\s+/g, '-'),
      })).select('id').single()

      if (data) {
        if (hoteles.length > 0) await supabase.from('hoteles').insert(hotelRows(data.id))
        const vr = vueloRows(data.id)
        if (vr.length > 0) await supabase.from('vuelos').insert(vr)
      }
    }

    router.push('/admin/ofertas')
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-linear-to-r from-[#11BCB3] to-[#072E40] text-white rounded-2xl px-6 py-5">
        <p className="text-xl font-semibold">{editingId ? 'Editar oferta' : 'Crear nueva oferta'}</p>
        <p className="text-sm text-white/70 mt-1">Configurá destino, precios y hoteles disponibles</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-lg font-semibold mb-5">Datos de la oferta</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Destino</label>
              <input className={inputCls} placeholder="Ej: Cancún" value={form.destino} onChange={e => setForm({ ...form, destino: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Origen</label>
              <input className={inputCls} placeholder="Ej: Buenos Aires" value={form.origen} onChange={e => setForm({ ...form, origen: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Mes</label>
              <input className={inputCls} placeholder="Ej: Julio 2025" value={form.mes} onChange={e => setForm({ ...form, mes: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Precio base (USD)</label>
              <input className={inputCls} placeholder="Ej: 1200" type="number" value={form.precio_base} onChange={e => setForm({ ...form, precio_base: e.target.value })} />
            </div>
          </div>
        </div>

        {/* ---- HERO ---- */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-lg font-semibold mb-5">Hero de la oferta</h2>
          <div className="flex flex-col gap-5">

            {/* imagen hero */}
            <div>
              <label className={labelCls}>Imagen de fondo del hero</label>
              <ImageInput
                value={form.imagen_hero}
                onChange={url => setForm({ ...form, imagen_hero: url })}
              />
            </div>

            {/* cuotas */}
            <div>
              <label className={labelCls}>Cuotas sin interés</label>
              <input
                className={inputCls}
                placeholder="Ej: 6 cuotas sin interés"
                value={form.cuotas}
                onChange={e => setForm({ ...form, cuotas: e.target.value })}
              />
              <p className="text-[11px] text-gray-400 mt-1">Aparece destacado en verde en el hero. Dejalo vacío si no aplica.</p>
            </div>

            {/* descripcion_corta */}
            <div>
              <label className={labelCls}>Descripción corta</label>
              <textarea
                className={inputCls + ' resize-none'}
                rows={3}
                maxLength={160}
                placeholder="Ej: Viaje soñado con todo incluido, vuelo directo y traslados."
                value={form.descripcion_corta}
                onChange={e => setForm({ ...form, descripcion_corta: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.descripcion_corta.length}/160</p>
            </div>

            {/* fecha_salida + expires_at */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Fecha de salida</label>
                <input
                  className={inputCls}
                  placeholder="Ej: 16 Oct 2026"
                  value={form.fecha_salida}
                  onChange={e => setForm({ ...form, fecha_salida: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Válido hasta</label>
                <input
                  className={inputCls}
                  type="date"
                  value={form.expires_at}
                  onChange={e => setForm({ ...form, expires_at: e.target.value })}
                />
                <p className="text-[11px] text-gray-400 mt-1">La oferta se oculta automáticamente después de esta fecha.</p>
              </div>
            </div>

            {/* incluye chips */}
            <div>
              <label className={labelCls}>Chips del hero (incluye)</label>
              <div className="flex flex-col gap-2">
                {form.incluye.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className={inputCls}
                      placeholder="Ej: 7 noches"
                      value={item}
                      onChange={e => {
                        const next = [...form.incluye]
                        next[i] = e.target.value
                        setForm({ ...form, incluye: next })
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, incluye: form.incluye.filter((_, j) => j !== i) })}
                      className="text-gray-300 hover:text-red-500 transition shrink-0"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-left text-xs text-[#11BCB3] hover:underline mt-1"
                  onClick={() => setForm({ ...form, incluye: [...form.incluye, ''] })}
                >
                  + Agregar item
                </button>
              </div>
            </div>

            {/* features */}
            <div>
              <label className={labelCls}>Features (card de precio)</label>
              <div className="flex flex-col gap-3">
                {form.features.map((f, i) => (
                  <div key={f.id} className="grid grid-cols-[120px_1fr_1fr_32px] gap-2 items-start">
                    <select
                      className={inputCls}
                      value={f.icon}
                      onChange={e => {
                        const next = [...form.features]
                        next[i] = { ...next[i], icon: e.target.value }
                        setForm({ ...form, features: next })
                      }}
                    >
                      {ICON_OPTIONS.map(o => (
                        <option key={o} value={o}>{ICON_LABELS[o]}</option>
                      ))}
                    </select>
                    <input
                      className={inputCls}
                      placeholder="Título"
                      value={f.title}
                      onChange={e => {
                        const next = [...form.features]
                        next[i] = { ...next[i], title: e.target.value }
                        setForm({ ...form, features: next })
                      }}
                    />
                    <input
                      className={inputCls}
                      placeholder="Subtítulo (opcional)"
                      value={f.subtitle}
                      onChange={e => {
                        const next = [...form.features]
                        next[i] = { ...next[i], subtitle: e.target.value }
                        setForm({ ...form, features: next })
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, features: form.features.filter((_, j) => j !== i) })}
                      className="text-gray-300 hover:text-red-500 transition pt-2"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-left text-xs text-[#11BCB3] hover:underline mt-1"
                  onClick={() => setForm({ ...form, features: [...form.features, { id: crypto.randomUUID(), icon: 'check', title: '', subtitle: '' }] })}
                >
                  + Agregar feature
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---- VUELOS ---- */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-lg font-semibold mb-6">Detalle del vuelo</h2>
          {([['ida', ida, setIda], ['vuelta', vuelta, setVuelta]] as const).map(([tipo, v, setV]) => (
            <div key={tipo} className="mb-8 last:mb-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#11BCB3] mb-3">
                {tipo === 'ida' ? '✈ Vuelo de ida' : '✈ Vuelo de vuelta'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Origen</label>
                  <input className={inputCls} placeholder="Ej: COR" value={v.origen} onChange={e => setV({ ...v, origen: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Destino</label>
                  <input className={inputCls} placeholder="Ej: CUN" value={v.destino} onChange={e => setV({ ...v, destino: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Salida</label>
                  <input className={inputCls} type="datetime-local" value={v.salida} onChange={e => setV({ ...v, salida: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Llegada</label>
                  <input className={inputCls} type="datetime-local" value={v.llegada} onChange={e => setV({ ...v, llegada: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Escala</label>
                  <input className={inputCls} placeholder="Ej: Lima (LIM)" value={v.escala} onChange={e => setV({ ...v, escala: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Duración</label>
                  <input className={inputCls} placeholder="Ej: 2h 10m" value={v.duracion} onChange={e => setV({ ...v, duracion: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Aerolínea</label>
                  <select className={inputCls} value={v.aerolinea} onChange={e => setV({ ...v, aerolinea: e.target.value })}>
                    <option value="">Seleccionar</option>
                    {AIRLINES.map(a => (
                      <option key={a.code} value={a.code}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Equipaje</label>
                  <input className={inputCls} placeholder="Ej: 23kg incluido" value={v.equipaje} onChange={e => setV({ ...v, equipaje: e.target.value })} />
                </div>
              </div>
              {tipo === 'ida' && <hr className="mt-6 border-gray-100" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Hoteles disponibles</h2>
            {hoteles.length > 0 && (
              <span className="text-xs text-gray-400">{hoteles.length} hotel{hoteles.length !== 1 ? 'es' : ''}</span>
            )}
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={hoteles.map(h => h.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-4">
                {hoteles.map(hotel => (
                  <SortableHotelCard key={hotel.id} hotel={hotel} onUpdate={updateHotel} onRemove={removeHotel} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {hoteles.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">Agregá hoteles para armar tu oferta</p>
          )}
          <button
            type="button"
            className="w-full mt-4 border border-[#072E40] text-[#072E40] px-3 py-2.5 rounded-lg hover:bg-[#072E40] hover:text-white text-sm font-medium transition"
            onClick={addHotel}
          >
            + Agregar hotel
          </button>
        </div>

        <PreviewOferta form={form} hoteles={hoteles} />

        <div className="sticky bottom-4">
          <button
            type="submit"
            className="w-full bg-[#11BCB3] text-white py-3 rounded-xl hover:opacity-90 shadow-md text-sm font-semibold transition"
          >
            {editingId ? 'Actualizar oferta' : 'Publicar oferta'}
          </button>
        </div>
      </form>
    </div>
  )
}
