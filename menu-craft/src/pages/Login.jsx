import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="tu@restaurante.com"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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

            <div className="mt-6 text-center">
              <span className="text-gray-600">
                ¿No tienes cuenta?
              </span>{" "}
              <Link
                to="/register"
                className="text-orange-600 font-medium hover:text-orange-700"
              >
                Regístrate gratis
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;