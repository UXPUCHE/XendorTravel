export default function Login() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#072E40] via-[#0b3b4f] to-[#11BCB3]">
      

      {/* RIGHT SIDE (form) */}
      <div className="flex w-full items-center justify-center px-6">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <img
              src="/xendortravel.svg"
              alt="Xendor Travel"
              className="mx-auto h-16 w-auto opacity-95"
            />
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">

            <div className="mb-6 text-center">
              <h1 className="text-white text-2xl font-semibold">Login</h1>
              <p className="text-white/60 text-sm mt-1">
                Ingresá con tu cuenta para continuar
              </p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="text-white/70 text-xs mb-1 block">
                CORREO ELECTRÓNICO
              </label>
              <input
                placeholder="ej: tuemail@gmail.com"
                className="w-full rounded-lg px-3 py-3 bg-white/90 outline-none text-sm"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="text-white/70 text-xs mb-1 block">
                CONTRASEÑA
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg px-3 py-3 bg-white/90 outline-none text-sm"
              />
            </div>

            {/* Button */}
            <button className="w-full bg-[#11BCB3] hover:opacity-90 transition text-white py-3 rounded-xl font-semibold">
              Ingresar a Xendor
            </button>

            {/* Forgot */}
            <div className="flex justify-between mt-4 text-xs">
              <span className="text-white/60 cursor-pointer hover:underline">
                ¿Olvidaste tu contraseña?
              </span>
              <span className="text-white/60 cursor-pointer hover:underline">
                Soporte
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}