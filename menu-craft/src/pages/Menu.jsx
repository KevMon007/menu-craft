import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UtensilsCrossed, AlertCircle } from "lucide-react";

function Menu() {
  const { slug } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/menu/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Restaurante no encontrado");
          setLoading(false);
          return;
        }

        setMenu(data);
      } catch {
        setError("Error de red, intenta de nuevo");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando menú...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!menu) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
            <UtensilsCrossed size={24} />
            <h1 className="text-2xl font-bold text-slate-900">
              {menu.restaurante.nombre}
            </h1>
          </div>
          <p className="text-gray-500 text-sm">Nuestro menú</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {menu.categorias.length === 0 && (
          <p className="text-center text-gray-400">
            Este restaurante aún no tiene platillos disponibles
          </p>
        )}

        {menu.categorias.map((categoria) => (
          <section key={categoria.id}>
            <h2 className="text-xl font-semibold text-slate-800 border-b-2 border-orange-500 pb-2 mb-4">
              {categoria.nombre}
            </h2>

            {categoria.platillos.length === 0 && (
              <p className="text-gray-400 text-sm">Sin platillos disponibles</p>
            )}

            <div className="space-y-3">
              {categoria.platillos.map((platillo) => (
                <div
                  key={platillo.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-800">
                      {platillo.nombre}
                    </h3>

                    {platillo.descripcion && (
                      <p className="text-sm text-gray-500 mt-1">
                        {platillo.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="font-semibold text-orange-600 text-lg">
                      ${parseFloat(platillo.precio).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-gray-200 py-6 mt-8">
        <p className="text-center text-xs text-gray-400">
          MenuCraft — Tu carta digital, en un escaneo.
        </p>
      </footer>
    </div>
  );
}

export default Menu;
