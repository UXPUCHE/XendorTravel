'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Pencil, Wrench, Settings, LogOut, Bell } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Crear oferta', href: '/admin/ofertas/nueva', icon: PlusCircle },
  { label: 'Editar ofertas', href: '/admin/ofertas', icon: Pencil },
  { label: 'Herramientas', href: '#', icon: Wrench },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userInitial, setUserInitial] = useState('?')
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata || {}
      const name = meta.name || data.user?.email?.split('@')[0] || ''
      setUserName(name)
      setUserInitial(name.charAt(0).toUpperCase())
      setUserAvatar(meta.avatar_url || '')
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#072E40] text-white flex flex-col shrink-0 h-screen sticky top-0">
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 text-2xl font-bold tracking-tight">Xendor</div>
          <div className="border-t border-white/10 mt-2 mb-4" />
          <nav className="px-3 space-y-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${active ? 'bg-white/10 font-semibold' : 'hover:bg-white/10'}`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* BOTTOM — siempre visible */}
        <div className="px-3 pb-4 shrink-0">
          <div className="border-t border-white/10 mb-3" />

          {/* Configuración */}
          <Link
            href="/admin/configuracion"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition w-full ${pathname === '/admin/configuracion' ? 'bg-white/10 font-semibold' : 'hover:bg-white/10'}`}
          >
            <Settings size={16} />
            Configuración
          </Link>

          {/* User + logout */}
          <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition">
            <div className="flex items-center gap-2 min-w-0">
              {userAvatar ? (
                <img src={userAvatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="Avatar" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#11BCB3] flex items-center justify-center text-xs font-bold shrink-0">
                  {userInitial}
                </div>
              )}
              <span className="text-xs text-white/70 truncate">{userName}</span>
            </div>
            <button onClick={handleLogout} title="Cerrar sesión" className="text-white/50 hover:text-white transition shrink-0 ml-2">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-[#DBD6D0]">
        <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm shrink-0">
          <input
            type="text"
            placeholder="¿Qué necesitás buscar?"
            className="bg-gray-100 rounded-full px-4 py-2 text-sm w-72 focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700"><Bell size={18} /></button>
            {userAvatar ? (
              <img src={userAvatar} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#072E40] text-white flex items-center justify-center text-sm font-semibold">
                {userInitial}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 text-[#072E40] p-8 flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  )
}
