'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Pencil, Wrench, Settings, LogOut, Mail, Bell } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Crear oferta', href: '/admin/ofertas', icon: PlusCircle },
  { label: 'Editar ofertas', href: '/admin/ofertas', icon: Pencil },
  { label: 'Herramientas', href: '#', icon: Wrench },
]

const bottomItems = [
  { label: 'Configuración', href: '#', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#072E40] text-white flex flex-col justify-between shrink-0">
        <div>
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
        <div className="px-3 pb-6 space-y-1">
          <div className="border-t border-white/10 mb-4" />
          {bottomItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
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
            <button className="text-gray-500 hover:text-gray-700"><Mail size={18} /></button>
            <button className="text-gray-500 hover:text-gray-700"><Bell size={18} /></button>
            <div className="w-8 h-8 rounded-full bg-[#072E40] text-white flex items-center justify-center text-sm font-semibold">N</div>
          </div>
        </header>

        <main className="flex-1 text-[#072E40] p-8 flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  )
}
