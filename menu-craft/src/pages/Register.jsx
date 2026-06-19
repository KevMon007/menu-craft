import { User, Mail, Lock, Eye, EyeOff, Store } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthHero from "../components/AuthHero";

function Register() {
  const [restaurantName, setRestaurantName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function generarSlug(nombre) {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!restaurantName.trim()) {
      setError("El nombre del restaurante es obligatorio");
      return;
    }
    if (!email.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_restaurante: restaurantName.trim(),
          slug: generarSlug(restaurantName),
          nombre_usuario: fullName.trim() || restaurantName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Error al crear la cuenta");
        setLoading(false);
        return;
      }

      navigate("/login", { replace: true });
    } catch {
      setError("Error de red, intenta de nuevo");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthHero
        title="Empieza gratis en"
        highlight="menos de 2 minutos."
        description="Crea tu cuenta y publica tu menú digital en cuestión de minutos."
        benefits={[
          "Sin tarjeta de crédito para empezar",
          "Tu menú publicado en minutos",
          "Actualiza tu carta en tiempo real",
        ]}
      />

      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 w-full max-w-lg">
          <h2 className="text-3xl font-bold text-slate-900">
            Crea tu cuenta
          </h2>

          <p className="text-gray-500 mt-2">
            Después configuras tu restaurante
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del restaurante *
              </label>

              <div className="relative">
                <Store
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  type="text"
                  placeholder="La Taquería"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del contacto
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="María García"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Correo electrónico *
              </label>

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
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña *
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirmar contraseña *
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Continuar →"}
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-600">
                ¿Ya tienes cuenta?
              </span>{" "}
              <Link
                to="/login"
                className="text-orange-600 font-medium hover:text-orange-700"
              >
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
