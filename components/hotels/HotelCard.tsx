export default function HotelCard({ hotel, waUrl }) {
  return (
    <div className="shrink-0 w-64 snap-start bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
      
      <div className="relative h-36 overflow-hidden">
        <img
          src={hotel.imagen || 'https://placehold.co/600x400'}
          alt={hotel.nombre}
          className="w-full h-full object-cover"
        />
        {hotel.badge && (
          <span className="absolute top-2 left-2 text-[11px] bg-[#072E40]/80 text-white font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
            {hotel.badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-semibold text-gray-900 text-sm leading-tight">
          {hotel.nombre}
        </p>

        <div className="flex items-center gap-0.5 mt-1 text-yellow-400 text-xs">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
          <span>All inclusive</span>
          <span>•</span>
          <span>7 noches</span>
        </div>

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