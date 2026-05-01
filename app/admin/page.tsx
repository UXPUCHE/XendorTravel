import { PlusCircle, Pencil, Wrench, MessageCircle, Image } from 'lucide-react'

const mainCards = [
  { label: 'Crear oferta', href: '/admin/ofertas', icon: PlusCircle },
  { label: 'Editar ofertas', href: '/admin/ofertas', icon: Pencil },
  { label: 'Herramientas', href: '#', icon: Wrench },
]

const secondaryCards = [
  { label: 'Generador WhatsApp', href: '#', icon: MessageCircle },
  { label: 'Editor de imágenes', href: '#', icon: Image },
]

export default function AdminHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Hola</h1>
      <p className="text-gray-500 mb-6">¿Qué te gustaría hacer hoy?</p>

      <div className="bg-gradient-to-r from-[#11BCB3] to-[#072E40] text-white rounded-2xl px-8 py-6 mb-6">
        <p className="text-lg font-semibold">Gestioná tus ofertas más rápido</p>
        <p className="text-sm text-white/70 mt-1">Creá, editá y publicá desde un solo lugar.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {mainCards.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="bg-white rounded-xl shadow-sm p-6 font-semibold hover:shadow-md transition flex flex-col gap-3"
          >
            <Icon size={20} className="text-[#11BCB3]" />
            {label}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {secondaryCards.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="bg-white rounded-xl shadow-sm p-6 font-semibold hover:shadow-md transition flex flex-col gap-3"
          >
            <Icon size={20} className="text-[#11BCB3]" />
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
