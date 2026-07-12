  import { useEffect, useState } from "react";
  import { Link, useParams, useSearchParams } from "react-router-dom";
  import { UtensilsCrossed, AlertCircle, ArrowLeft } from "lucide-react";

  import MenuHero from "../../components/menu/MenuHero";
  import CategoryTabs from "../../components/menu/CategoryTabs";
  import ProductGrid from "../../components/menu/ProductGrid";
  import EmptyMenu from "../../components/menu/EmptyMenu";
  import PhoneFrame from "../../components/menu/PhoneFrame";

  const API_URL = import.meta.env.VITE_API_URL || "";

  function Menu() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const isPreview =
    searchParams.get("preview") === "true";

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

    const menuContent = (
        <>
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
                                preview={isPreview}
                            />
                        )
                }

            </main>

            <footer className="border-t border-gray-200 py-6 mt-8">

                <p className="text-center text-xs text-gray-400">

                    MenuCraft — Tu carta digital, en un escaneo.

                </p>

            </footer>
        </>
    );

    if (isPreview) {

        return (

            <div className="min-h-screen bg-slate-100">

                {/* Barra superior */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        bg-white
                        px-6
                        py-3
                    "
                >

                    <Link
                        to="/public-menu"
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-slate-700
                            transition
                            hover:text-orange-600
                        "
                    >

                        <ArrowLeft size={18} />

                        Volver a Gestión del Menú

                    </Link>

                    <p
                        className="
                            hidden
                            text-sm
                            text-gray-500
                            md:block
                        "
                    >

                        Vista previa del menú público

                    </p>

                </div>

                <div
                    className="
                        flex
                        justify-center
                        py-10
                        px-6
                    "
                >

                    <PhoneFrame>

                        {menuContent}

                    </PhoneFrame>

                </div>

            </div>

        );

    }

    return (
      <div className="min-h-screen bg-gray-50">

        {menuContent}

    </div>
    );
  }

  export default Menu;
