'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  value?: string
  onChange: (url: string) => void
}

export function ImageInput({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [hover, setHover] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('hoteles').upload(path, file, { upsert: false })
    if (!error) {
      const { data } = supabase.storage.from('hoteles').getPublicUrl(path)
      onChange(data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Square preview / placeholder */}
      <div
        className="relative w-full h-28 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 cursor-pointer hover:border-[#11BCB3] hover:bg-[#11BCB3]/5 transition-all"
        onClick={() => !uploading && fileRef.current?.click()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            {(hover || uploading) && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center gap-2 text-gray-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-xs font-medium">
              {uploading ? 'Subiendo...' : 'Subir imagen'}
            </span>
          </div>
        )}
      </div>

      {/* URL input */}
      <input
        type="text"
        placeholder="O pegá una URL..."
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#11BCB3] transition text-gray-600 placeholder:text-gray-400"
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
