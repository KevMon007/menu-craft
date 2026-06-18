function Login() {
  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-950 via-slate-800 to-orange-900">
        <div className="p-10 w-full">
          <h1 className="text-white text-2xl font-bold">
            MenuCraft
          </h1>
          <div className="mt-32">
            <h2 className="text-5xl font-bold text-white leading-tight">
              Tu carta digital,
              <br />
              <span className="text-orange-500">
                en un escaneo.
              </span>
            </h2>

            <p className="text-gray-400 mt-6 text-lg">
              La plataforma de menús QR pensada para restaurantes mexicanos.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-orange-500"></div>
              <span className="text-gray-300">
                Menú actualizable en tiempo real
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-orange-500"></div>
              <span className="text-gray-300">
                Códigos QR personalizados para tu marca
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-orange-500"></div>
              <span className="text-gray-300">
                Compatible con todos los dispositivos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900">
            Bienvenido de nuevo
          </h2>

          <p className="text-gray-500 mt-2">
            Inicia sesión en tu cuenta para continuar
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                placeholder="tu@restaurante.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>

              <input
                type="password"
                placeholder="********"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;