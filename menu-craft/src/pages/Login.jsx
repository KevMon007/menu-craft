import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthHero from "../components/AuthHero";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || data?.message || "Credenciales inválidas");
        setLoading(false);
        return;
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("restaurantSlug", data.usuario?.slug || "");
        navigate("/dashboard", { replace: true });
      } else {
        setError("Respuesta inválida del servidor");
        setLoading(false);
      }
    } catch {
      setError("Error de red, intenta de nuevo");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthHero
        title="Tu carta digital,"
        highlight="en un escaneo."
        description="La plataforma de menús QR pensada para restaurantes mexicanos."
        benefits={[
          "Menú actualizable en tiempo real",
          "Códigos QR personalizados para tu marca",
          "Compatible con todos los dispositivos",
        ]}
      />

      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900">
            Bienvenido de nuevo
          </h2>

          <p className="text-gray-500 mt-2">
            Inicia sesión en tu cuenta para continuar
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="tu@restaurante.com"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                required
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

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
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
