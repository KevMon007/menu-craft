import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UtensilsCrossed, AlertCircle } from "lucide-react";

import MenuHero from "../../components/menu/MenuHero";
import CategoryTabs from "../../components/menu/CategoryTabs";
import ProductGrid from "../../components/menu/ProductGrid";
import EmptyMenu from "../../components/menu/EmptyMenu";

const API_URL = import.meta.env.VITE_API_URL || "";

function Menu() {
  const { slug } = useParams();

  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/menu/${slug}`);
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
        <MenuHero
            restaurant={menu.restaurante}
        />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <CategoryTabs
            categories={menu.categorias}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
        />

        {
            menu.categorias.length === 0
                ? <EmptyMenu />
                : (
                    <ProductGrid
                        categories={menu.categorias}
                        selectedCategory={selectedCategory}
                    />
                )
        }
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
