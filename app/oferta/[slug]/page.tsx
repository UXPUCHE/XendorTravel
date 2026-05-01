import { supabase } from '@/lib/supabase'
import { getAirlineLogo } from '@/lib/airlines'
import HotelesCarousel from '@/components/carousel/HotelesCarousel'

// NOTE:
// v.aerolinea MUST be airline code (e.g. "LA", "AR", "AA")
// If you pass "LATAM" instead of "LA", logos will NOT render.

type Feature = {
  icon: string
  title: string
  subtitle?: string
  highlight?: boolean
}

type Oferta = {
  id: string
  destino: string
  origen: string
  mes: string
  precio_base: number
  moneda: string
  base: string
  incluye: string[]
  features?: Feature[]
  fecha_salida?: string
  descripcion_corta?: string
}

type Hotel = {
  id: string
  nombre: string
  precio: number
  badge?: string
  imagen?: string
  principal?: boolean
  estrellas?: number
  regimen?: string
  noches?: number
}

type Vuelo = {
  id: string
  tipo: 'ida' | 'vuelta'
  origen: string
  destino: string
  salida?: string
  llegada?: string
  escala?: string
  duracion?: string
  aerolinea?: string
  equipaje?: string
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80'
const WA_NUMBER = '5493516678823'

function waLink(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

// ---- ICONS ----

const IconCheck = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
  </svg>
)

const IconCheckCircle = () => (
  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
)

const IconCalendar = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
    <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
  </svg>
)

const IconChevronDown = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
  </svg>
)

const IconMoon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const IconUsers = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
)

const IconPlane = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
)


const IconWhatsApp = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 448 512">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
)

const IconCar = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-8l-2.08-5.99zM6.5 16a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
)

const IconHotel = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9a4 4 0 00-4-4z" />
  </svg>
)

const IconShield = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
)

function getFeatureIcon(icon: string) {
  if (icon === 'plane') return IconPlane
  if (icon === 'car') return IconCar
  if (icon === 'hotel') return IconHotel
  if (icon === 'shield') return IconShield
  return IconCheck
}

// ---- HERO ----

function heroIconFor(label: string) {
  const l = label.toLowerCase()
  if (l.includes('noch')) return IconMoon
  if (l.includes('all inclusive') || l.includes('inclusive')) return IconUsers
  if (l.includes('aereo') || l.includes('aéreo') || l.includes('vuelo') || l.includes('traslado')) return IconPlane
  return IconCheck
}

function HeroOferta({ oferta, heroBg, waUrl }: { oferta: Oferta; heroBg: string; waUrl: string }) {
  const chips = (oferta.incluye ?? [])
    .filter(i => {
      const l = i.toLowerCase()
      return (
        l.includes('noche') ||
        l.includes('all') ||
        l.includes('aereo') ||
        l.includes('aéreo') ||
        l.includes('traslado') ||
        l.includes('equipaje')
      )
    })
    .filter(i => !i.toLowerCase().includes('asistencia'))
    .slice(0, 4)

  return (
    <section className="relative w-full" style={{ minHeight: 520 }}>
      <img src={heroBg} alt={oferta.destino} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-8 items-start">

        {/* LEFT */}
        <div className="flex-1 text-white">
          {oferta.origen && (
            <span className="inline-block bg-[#11BCB3] text-white text-[11px] font-bold px-3 py-1 rounded mb-4 uppercase tracking-widest">
              {oferta.origen}
            </span>
          )}

          <h1 className="text-5xl md:text-6xl font-extrabold leading-none tracking-tight">
            {oferta.destino}
          </h1>

          {oferta.base && (
            <p className="text-yellow-400 italic text-2xl font-semibold mt-2">{oferta.base}</p>
          )}

          {oferta.descripcion_corta && (
            <p className="text-white/75 text-sm mt-3 max-w-sm leading-relaxed">{oferta.descripcion_corta}</p>
          )}

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
              {chips.map((item, i) => {
                const Icon = heroIconFor(item)
                return (
                  <span key={i} className="flex items-center gap-1.5 text-white/90 text-sm">
                    <Icon />
                    {item}
                  </span>
                )
              })}
            </div>
          )}

          <div className="mt-5 inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-2.5 text-white/90 text-sm bg-white/10 backdrop-blur-sm">
            <IconCalendar />
            <span>
              Salidas desde{' '}
              <strong className="font-semibold">{oferta.fecha_salida || oferta.mes}</strong>
            </span>
            <IconChevronDown />
          </div>
        </div>

        {/* RIGHT: price card */}
        <div className="w-full md:w-[420px] lg:w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden shrink-0 p-6 flex justify-center">
          <div className="w-full max-w-[320px]">
            {/* Price */}
            <div className="mb-3">
              <p className="text-gray-400 text-[14px] tracking-tight font-normal mt-0.5">Desde</p>
              <p className="text-[#072E40] text-5xl font-extrabold leading-none mt-0.5">
                {oferta.moneda || 'USD'} {oferta.precio_base.toLocaleString('en-US')}
              </p>
              <p className="text-gray-500 text-sm mt-1 tracking-tight">
                Por persona en base {oferta.base || 'doble'}
              </p>
            </div>

            {/* Cuotas dinámicas */}
            {(() => {
              const cuotaFeature = oferta.features?.find(f =>
                f.title.toLowerCase().includes('cuota')
              )
              return cuotaFeature ? (
                <div className="flex items-center gap-2 text-[#11BCB3] font-semibold text-md mb-4">
                  <IconCheckCircle />
                  {cuotaFeature.title}
                </div>
              ) : null
            })()}

            <div className="border-t border-gray-200 my-6"></div>

            {/* Feature list */}
            {oferta.features && oferta.features.length > 0 ? (
              <ul className="space-y-4 mb-5">
                {oferta.features
                  .filter(f => !f.title.toLowerCase().includes('cuota'))
                  .map((f, i) => {
                    const Icon = getFeatureIcon(f.icon)
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[#11BCB3] mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center">
                          <Icon />
                        </span>
                        <span>
                          <span className="block text-md tracking-tight font-medium text-gray-800">{f.title}</span>
                          {f.subtitle && (
                            <span className="block text-sm text-gray-400 mt-0">{f.subtitle}</span>
                          )}
                        </span>
                      </li>
                    )
                  })}
              </ul>
            ) : null}

            <a
              href={waUrl}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-[#072E40] hover:bg-[#0b3d57] text-white font-semibold py-3.5 rounded-2xl transition w-full text-sm"
            >
              Consultar disponibilidad
              <IconWhatsApp />
            </a>
            <p className="text-center text-[11px] text-gray-400 mt-2 leading-snug">
              Precio sujeto a disponibilidad al momento de la reserva.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---- VUELO ----

const IconPlaneLine = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14" strokeLinecap="round"/>
    <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function DetalleVuelo({ oferta, vuelos }: { oferta: Oferta; vuelos: Vuelo[] }) {
  const ida = vuelos.find(v => v.tipo === 'ida')
  const vuelta = vuelos.find(v => v.tipo === 'vuelta')

  function fmt(dt?: string) {
    if (!dt) return null
    const d = new Date(dt)
    const month = d.toLocaleString('es', { month: 'short' })
    const cap = month.charAt(0).toUpperCase() + month.slice(1)
    return `${d.getDate()} ${cap} ${d.getFullYear()} · ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  function FlightRow({
    tipo, origenStr, destinoStr, v,
  }: {
    tipo: string; origenStr: string; destinoStr: string; v?: Vuelo
  }) {
    return (
      <div className="flex items-center justify-between gap-6 py-6 px-6">

        {/* LEFT: icon + tipo */}
        <div className="flex items-center gap-3 min-w-[90px]">
          <span className="text-[#11BCB3]">
            <IconPlaneLine
              className={`transition-transform ${
                tipo === 'IDA'
                  ? 'rotate-0'
                  : 'rotate-180'
              } origin-center`}
            />
          </span>
          <span className="text-[14px] font-bold text-gray-400 uppercase tracking-wider">
            {tipo}
          </span>
        </div>

        {/* ORIGEN */}
        <div className="flex-1">
          <p className="font-semibold text-[#072E40] text-md">{origenStr}</p>
          {fmt(v?.salida) && (
            <p className="text-xs text-gray-400 mt-0.5">{fmt(v?.salida)}</p>
          )}
        </div>

        {/* LINEA + ESCALA */}
        <div className="flex flex-col items-center min-w-[160px]">
          <p className="text-[12px] text-gray-500">
            {v?.escala ? `Escala en ${v.escala}` : ''}
          </p>
          <div className="w-full flex items-center gap-1 my-1">
            <div className="flex-1 border-t border-dashed border-gray-300" />
            <span className="w-3 h-3 rounded-full bg-[#11BCB3]" />
            <div className="flex-1 border-t border-dashed border-gray-300" />
          </div>
          <p className="text-[11px] text-gray-400">
            {v?.duracion ?? ''}
          </p>
        </div>

        {/* DESTINO */}
        <div className="flex-1 text-right">
          <p className="font-semibold text-[#072E40] text-md">{destinoStr}</p>
          {fmt(v?.llegada) && (
            <p className="text-xs text-gray-400 mt-0.5">{fmt(v?.llegada)}</p>
          )}
        </div>

        {/* AEROLINEA + EQUIPAJE */}
        <div className="text-right min-w-[110px]">
          {v?.aerolinea && (
            <div className="flex items-center justify-end">
              {(() => {
                const code = v.aerolinea?.toUpperCase()
                const normalizedCode = code === 'LATAM' ? 'LA' : code
                const logo = getAirlineLogo(normalizedCode)
                return (
                  <>
                    {logo ? (
                      <img
                        src={logo}
                        alt={v.aerolinea}
                        className="h-10 object-contain"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-gray-600">
                        {v.aerolinea}
                      </span>
                    )}
                  </>
                )
              })()}
            </div>
          )}
          {v?.equipaje && (
            <p className="text-[11px] text-gray-400 mt-1">
              {v.equipaje}
            </p>
          )}
        </div>

      </div>
    )
  }

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-[#072E40] mb-4">Detalle del vuelo</h2>
        <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          <FlightRow
            tipo="IDA"
            origenStr={ida?.origen || oferta.origen || '—'}
            destinoStr={ida?.destino || oferta.destino}
            v={ida}
          />
          <FlightRow
            tipo="VUELTA"
            origenStr={vuelta?.origen || oferta.destino}
            destinoStr={vuelta?.destino || oferta.origen || '—'}
            v={vuelta}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {vuelos.length > 0
            ? 'Los horarios están sujetos a cambios por parte de la aerolínea.'
            : 'Fechas estimadas. Consultanos para ajustarlas según tu disponibilidad.'}
        </p>
      </div>
    </section>
  )
}

// ---- HOTEL PRINCIPAL ----

function HotelPrincipal({ hotel, oferta, waUrl }: { hotel: Hotel; oferta: Oferta; waUrl: string }) {
  const incluye = oferta.incluye ?? []
  const estrellas = hotel.estrellas ?? 4

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-[#072E40] mb-5">Hotel incluido en el paquete</h2>

        <div className="flex flex-col md:flex-row md:h-80 rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">

          {/* IMAGE */}
          <div className="md:w-1/2 h-48 md:h-full shrink-0 relative overflow-hidden">
            <img
              src={hotel.imagen || PLACEHOLDER}
              alt={hotel.nombre}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            {hotel.badge && (
              <span className="absolute top-3 left-3 text-xs font-bold bg-[#11BCB3] text-white px-3 py-1 rounded-full shadow">
                {hotel.badge.toUpperCase()}
              </span>
            )}
          </div>

          {/* INFO */}
          <div className="flex-1 p-6 flex flex-col justify-between">

            {/* TOP: nombre + precio */}
            <div className="flex items-start justify-between gap-4">

              {/* NOMBRE / LOCATION / ESTRELLAS */}
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#072E40] leading-tight">
                  {hotel.nombre}
                </h3>
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                  <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/>
                  </svg>
                  {oferta.destino}
                </p>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {Array.from({ length: estrellas }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              </div>

              {/* PRECIO — todo alineado derecha */}
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400 leading-none">Desde</p>
                <div className="flex items-end justify-end gap-1 leading-none mt-0.5">
                  <span className="text-base font-semibold text-[#072E40]">USD</span>
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#072E40]">
                    {hotel.precio.toLocaleString('es-AR')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Por persona en base doble</p>
              </div>

            </div>

            {/* PILLS */}
            {incluye.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {incluye.slice(0, 4).map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs font-medium text-[#072E40] bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                    <span className="text-[#11BCB3]"><IconCheck /></span>
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <p className="text-[11px] text-gray-400 leading-snug">
                ⚠️ Precio sujeto a disponibilidad al momento de la reserva
              </p>
              <a
                href={waUrl}
                target="_blank"
                className="flex items-center gap-2 bg-[#11BCB3] hover:bg-[#0ea5a0] text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] text-sm whitespace-nowrap shrink-0"
              >
                Ver disponibilidad por WhatsApp
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

// ---- HOTEL CARD ----

function HotelCard({ hotel, waUrl }: { hotel: Hotel; waUrl: string }) {
  return (
    <div className="shrink-0 w-64 snap-start bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
      
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={hotel.imagen || PLACEHOLDER}
          alt={hotel.nombre}
          className="w-full h-full object-cover"
        />
        {hotel.badge && (
          <span className="absolute top-2 left-2 text-[11px] bg-[#072E40]/80 text-white font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
            {hotel.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        
        {/* Title */}
        <p className="font-semibold text-gray-900 text-sm leading-tight">
          {hotel.nombre}
        </p>

        {/* Fake stars (visual only for now) */}
        <div className="flex items-center gap-0.5 mt-1 text-yellow-400 text-xs">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
          <span>All inclusive</span>
          <span>•</span>
          <span>7 noches</span>
        </div>

        {/* Price */}
        <div className="mt-3">
          <p className="text-[12px] text-gray-400 font-medium leading-none mb-[1px]">
            Desde
          </p>

          <p className="flex items-end gap-1 text-[#072E40] leading-none">
            <span className="text-lg font-semibold">USD</span>
            <span className="text-3xl font-extrabold tracking-tight">
              {hotel.precio.toLocaleString('es-AR')}
            </span>
          </p>

          <p className="text-sm text-gray-500 tracking-tight mt-0">
            Por persona en base doble
          </p>
        </div>

        {/* CTA */}
        <a
          href={waUrl}
          target="_blank"
          className="block mt-4 text-center text-xs font-bold bg-[#11BCB3] hover:bg-[#0ea5a0] text-white py-2.5 rounded-lg transition"
        >
          Ver disponibilidad
        </a>

      </div>
    </div>
  )
}

// ---- CAROUSEL ----

// ---- CTA ----

function FamilyPlanBlock({ waUrl }: { waUrl: string }) {
  return (
    <section className="bg-[#F0FBF9] border-y border-[#11BCB3]/20">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#11BCB3]/15 flex items-center justify-center shrink-0 text-2xl">
            👨‍👩‍👧‍👦
          </div>
          <div>
            <p className="text-[#072E40] font-bold text-lg leading-tight">
              Family Plan disponible
            </p>
            <p className="text-gray-500 text-sm mt-0.5">
              Consultá tarifas especiales para 2 adultos + 2 menores de 12 años
            </p>
          </div>
        </div>
        <a
          href={waUrl}
          target="_blank"
          className="shrink-0 flex items-center gap-2 bg-[#11BCB3] hover:bg-[#0ea5a0] text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition text-sm whitespace-nowrap"
        >
          Consultar ahora
        </a>
      </div>
    </section>
  )
}

function CTAFinal({ waUrlGeneral }: { waUrlGeneral: string }) {
  return (
    <section className="bg-[#072E40]">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19l14-7L5 5v5l10 2-10 2v5z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">
              &iquest;Ten&eacute;s dudas o quer&eacute;s personalizar tu viaje?
            </p>
            <p className="text-white/50 text-sm mt-0.5">
              Nuestros asesores est&aacute;n listos para ayudarte.
            </p>
          </div>
        </div>
        <a
          href={waUrlGeneral}
          target="_blank"
          className="shrink-0 flex items-center gap-2 bg-[#11BCB3] hover:bg-[#0ea5a0] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition text-sm"
        >
          Escribinos por WhatsApp
        </a>
      </div>
    </section>
  )
}

// ---- PAGE ----

export default async function OfertaPage({ params }: any) {
  const { slug } = await params

  const { data: oferta } = await supabase
    .from('ofertas')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!oferta) return <div className="p-8 text-gray-500">Oferta no encontrada</div>

  const expirada = oferta.expires_at && new Date(oferta.expires_at) < new Date()
  if (expirada) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">✈️</p>
      <h1 className="text-2xl font-bold text-[#072E40] mb-2">Esta oferta ya no está disponible</h1>
      <p className="text-gray-500 mb-6">El paquete venció o fue dado de baja. Consultanos por nuevas fechas.</p>
      <a
        href={`https://wa.me/5493516678823?text=${encodeURIComponent('Hola! Consulto por disponibilidad de nuevas fechas para el paquete a ' + oferta.destino)}`}
        target="_blank"
        className="flex items-center gap-2 bg-[#11BCB3] text-white font-bold px-6 py-3 rounded-xl text-sm"
      >
        Consultar nuevas fechas por WhatsApp
      </a>
    </div>
  )

  const [{ data: hoteles }, { data: vuelos }] = await Promise.all([
    supabase
      .from('hoteles')
      .select('*')
      .eq('oferta_id', oferta.id)
      .order('principal', { ascending: false })
      .order('orden', { ascending: true }),
    supabase
      .from('vuelos')
      .select('*')
      .eq('oferta_id', oferta.id)
      .order('tipo', { ascending: true }),
  ])

  const lista: Hotel[] = hoteles ?? []
  const principal = lista.find(h => h.principal) ?? lista[0]
  const resto = lista.filter(h => h.id !== principal?.id)
  const heroBg = principal?.imagen || PLACEHOLDER

  console.log('HOTEL DEBUG -> lista:', lista)
  console.log('HOTEL DEBUG -> principal:', principal)
  console.log('HOTEL DEBUG -> resto:', resto)

  const waUrl = (hotel: Hotel) =>
    waLink(
      `Hola! Quiero info sobre el paquete a ${oferta.destino} en ${oferta.mes} con el hotel ${hotel.nombre} desde USD ${hotel.precio}.`
    )

  const waUrlGeneral = waLink(
    `Hola! Quiero consultar el paquete a ${oferta.destino} en ${oferta.mes}. Me pasás más info?`
  )

  return (
    <div className="min-h-screen bg-white">
      {principal && (
        <HeroOferta oferta={oferta} heroBg={heroBg} waUrl={waUrl(principal)} />
      )}
      <DetalleVuelo oferta={oferta} vuelos={(vuelos ?? []) as Vuelo[]} />
      {principal && (
        <>
          <HotelPrincipal hotel={principal} oferta={oferta} waUrl={waUrl(principal)} />
          {(() => {
            const hotelesMapped = resto.map(h => ({
              ...h,
              waUrl: waUrl(h)
            }))
            console.log('HOTEL DEBUG -> hotelesMapped:', hotelesMapped)
            return <HotelesCarousel hoteles={hotelesMapped} />
          })()}
        </>
      )}
      <FamilyPlanBlock waUrl={waLink(`Hola! Quiero consultar tarifas Family Plan para el paquete a ${oferta.destino} en ${oferta.mes} (2 adultos + 2 menores). Me pasás info?`)} />
      <CTAFinal waUrlGeneral={waUrlGeneral} />
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 md:hidden z-50">
        <a
          href={waUrlGeneral}
          className="block text-center bg-[#11BCB3] text-white py-3 rounded-lg font-bold text-sm"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  )
}
