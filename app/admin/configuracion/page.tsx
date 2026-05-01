'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera } from 'lucide-react'

export default function ConfiguracionPage() {
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')

  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [savingPerfil, setSavingPerfil] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata || {}
      setEmail(data.user?.email || '')
      setNombre(meta.name || '')
      setAvatarUrl(meta.avatar_url || '')
    })
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `avatars/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('PCIMG').upload(fileName, file)
    if (uploadError) { showToast('Error al subir imagen ❌'); setAvatarUploading(false); return }
    const { data } = supabase.storage.from('PCIMG').getPublicUrl(fileName)
    setAvatarUrl(data.publicUrl)
    setAvatarUploading(false)
  }

  const handleSavePerfil = async () => {
    setSavingPerfil(true)
    const { error } = await supabase.auth.updateUser({
      data: { name: nombre, avatar_url: avatarUrl }
    })
    setSavingPerfil(false)
    if (error) showToast('Error al guardar ❌')
    else showToast('Perfil actualizado ✓')
  }

  const handleChangePassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) showToast('Error al enviar email ❌')
    else showToast('Te enviamos un email para cambiar la contraseña ✉️')
  }

  const inputCls = 'bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#11BCB3] text-sm transition'
  const labelCls = 'text-xs uppercase tracking-wide text-gray-500 mb-1 block font-medium'
  const saveBtnCls = 'bg-[#11BCB3] hover:bg-[#0ea5a0] text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition disabled:opacity-50 w-fit'

  const initial = nombre ? nombre.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col gap-6 max-w-xl">

      <div>
        <h1 className="text-3xl font-bold text-[#072E40]">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Administrá tu cuenta y preferencias</p>
      </div>

      {/* PERFIL */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-[#072E40]">Perfil</h2>

        {/* AVATAR */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} className="w-16 h-16 rounded-full object-cover" alt="Avatar" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#11BCB3] flex items-center justify-center text-white text-2xl font-bold">
                {initial}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-6 h-6 bg-[#072E40] rounded-full flex items-center justify-center text-white hover:bg-[#0b3d57] transition"
            >
              <Camera size={12} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f) }}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-[#072E40]">{nombre || 'Sin nombre'}</p>
            <p className="text-xs text-gray-400">{email}</p>
            {avatarUploading && <p className="text-xs text-[#11BCB3] mt-1">Subiendo imagen...</p>}
          </div>
        </div>

        {/* NOMBRE */}
        <div>
          <label className={labelCls}>Nombre</label>
          <input
            className={inputCls}
            placeholder="Ej: Nicolás"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        {/* EMAIL (readonly) */}
        <div>
          <label className={labelCls}>Email</label>
          <input className={inputCls + ' opacity-60 cursor-not-allowed'} value={email} disabled />
          <p className="text-xs text-gray-400 mt-1">El email no se puede cambiar desde acá.</p>
        </div>

        <button onClick={handleSavePerfil} disabled={savingPerfil} className={saveBtnCls}>
          {savingPerfil ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </div>

      {/* CONTRASEÑA */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-[#072E40]">Contraseña</h2>
        <p className="text-sm text-gray-500">
          Te enviamos un email con el link para cambiar tu contraseña.
        </p>
        <button
          onClick={handleChangePassword}
          className="border border-[#072E40] text-[#072E40] hover:bg-[#072E40] hover:text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition w-fit"
        >
          Enviar email de cambio de contraseña
        </button>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#072E40] text-white text-sm px-5 py-3 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
