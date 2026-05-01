'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ConfiguracionPage() {
  const [email, setEmail] = useState('')
  const [waNumber, setWaNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || '')
      const wa = data.user?.user_metadata?.wa_number || ''
      setWaNumber(wa)
    })
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveWa = async () => {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { wa_number: waNumber }
    })
    setSaving(false)
    if (error) showToast('Error al guardar ❌')
    else showToast('Guardado ✓')
  }

  const handleChangePassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) showToast('Error al enviar email ❌')
    else showToast('Te enviamos un email para cambiar la contraseña ✉️')
  }

  const inputCls = 'bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#11BCB3] text-sm'
  const labelCls = 'text-xs uppercase tracking-wide text-gray-500 mb-1 block font-medium'

  return (
    <div className="flex flex-col gap-6 max-w-xl">

      <div>
        <h1 className="text-3xl font-bold text-[#072E40]">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Administrá tu cuenta y preferencias</p>
      </div>

      {/* CUENTA */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-[#072E40]">Cuenta</h2>

        <div>
          <label className={labelCls}>Email</label>
          <input className={inputCls} value={email} disabled />
          <p className="text-xs text-gray-400 mt-1">El email no se puede cambiar desde acá.</p>
        </div>

        <div>
          <label className={labelCls}>Contraseña</label>
          <button
            onClick={handleChangePassword}
            className="text-sm text-[#11BCB3] hover:underline"
          >
            Enviar email para cambiar contraseña →
          </button>
        </div>
      </div>

      {/* WHATSAPP */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-[#072E40]">WhatsApp</h2>
        <p className="text-sm text-gray-500 -mt-3">
          Número al que llegan las consultas desde las landings. Incluí el código de país sin el +.
        </p>

        <div>
          <label className={labelCls}>Número (ej: 5493516678823)</label>
          <input
            className={inputCls}
            placeholder="5493516678823"
            value={waNumber}
            onChange={e => setWaNumber(e.target.value)}
          />
        </div>

        <button
          onClick={handleSaveWa}
          disabled={saving}
          className="bg-[#11BCB3] hover:bg-[#0ea5a0] text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition disabled:opacity-50 w-fit"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#072E40] text-white text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
