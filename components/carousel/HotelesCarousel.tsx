'use client'

import React from 'react'
import HotelCard from '@/components/hotels/HotelCard'
import CarouselArrow from '@/components/carousel/CarouselArrow'

type HotelCarouselItem = {
  id: string
  nombre: string
  precio: number
  imagen?: string
  badge?: string
  waUrl: string
}

type Props = {
  hoteles: HotelCarouselItem[]
}

export default function HotelesCarousel({ hoteles }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [hasOverflow, setHasOverflow] = React.useState(false)
  const isAdjustingRef = React.useRef(false)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const sectionWidth = el.scrollWidth / 3
    el.scrollTo({ left: sectionWidth, behavior: 'auto' })
    setHasOverflow(el.scrollWidth > el.clientWidth)
  }, [])

  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <h2 className="text-xl font-bold text-[#072E40] mb-2">
          Podés elegir otro hotel según disponibilidad
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Consultá opciones alternativas para este paquete.
        </p>

        <div className="relative px-10">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <CarouselArrow
            direction="left"
            visible={hasOverflow}
            onClick={() => {
              const el = containerRef.current
              if (!el) return
              const card = el.querySelector('[data-card]') as HTMLElement
              const width = card?.clientWidth || 320
              el.scrollBy({ left: -(width + 16), behavior: 'smooth' })
            }}
          />
          <div
            ref={containerRef}
            onScroll={() => {
              const el = containerRef.current
              if (!el || isAdjustingRef.current) return

              const sectionWidth = el.scrollWidth / 3
              const leftEdge = sectionWidth * 0.25
              const rightEdge = sectionWidth * 1.75

              if (el.scrollLeft <= leftEdge) {
                isAdjustingRef.current = true
                el.scrollTo({ left: el.scrollLeft + sectionWidth, behavior: 'auto' })
                requestAnimationFrame(() => {
                  isAdjustingRef.current = false
                })
              }

              if (el.scrollLeft >= rightEdge) {
                isAdjustingRef.current = true
                el.scrollTo({ left: el.scrollLeft - sectionWidth, behavior: 'auto' })
                requestAnimationFrame(() => {
                  isAdjustingRef.current = false
                })
              }
            }}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1"
          >
            {[...hoteles, ...hoteles, ...hoteles].map((hotel, i) => (
              <div key={`${hotel.id}-${i}`} className="snap-start" data-card>
                <HotelCard
                  hotel={hotel as any}
                  waUrl={hotel.waUrl}
                />
              </div>
            ))}
          </div>
          <CarouselArrow
            direction="right"
            visible={hasOverflow}
            onClick={() => {
              const el = containerRef.current
              if (!el) return
              const card = el.querySelector('[data-card]') as HTMLElement
              const width = card?.clientWidth || 320
              el.scrollBy({ left: width + 16, behavior: 'smooth' })
            }}
          />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
        </div>

      </div>
    </section>
  )
}