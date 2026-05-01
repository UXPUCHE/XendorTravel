'use client'

import React from 'react'

type Props = {

  direction: 'left' | 'right'

  onClick: () => void

  visible?: boolean

}

export default function CarouselArrow({ direction, onClick, visible = true }: Props) {

  if (!visible) return null

  const isLeft = direction === 'left'

  return (

    <button

      onClick={onClick}

      className={`

        hidden md:flex items-center justify-center

        absolute top-1/2 -translate-y-1/2

        ${isLeft ? '-left-6' : '-right-6'}

        z-20

        w-11 h-11

        rounded-full

        bg-white/95 backdrop-blur

        border border-gray-200

        shadow-md

        hover:shadow-xl hover:scale-110

        transition-all duration-200

        active:scale-95

      `}

    >

      <span className="text-[#072E40] text-lg font-bold leading-none">

        {isLeft ? '‹' : '›'}

      </span>

    </button>

  )

}