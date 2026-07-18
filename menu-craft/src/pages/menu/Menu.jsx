  import { useEffect, useState } from "react";
  import { useNavigate, useParams, useSearchParams } from "react-router-dom";
  import { AlertCircle, ArrowLeft } from "lucide-react";

  import PhoneFrame from "../../components/menu/PhoneFrame";
  import MenuView from "../../components/menu/MenuView";
  import { API_BASE_URL } from "../../services/api";

  function Menu() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isPreview =
    searchParams.get("preview") === "true";

    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const handleBack = () => {

        if (window.opener) {

            window.close();

            return;

        }

        navigate("/public-menu");

    };

    useEffect(() => {
      async function loadMenu() {
        setLoading(true);
        setError(null);

        try {
          const res = await fetch(`${API_BASE_URL}/api/menu/${slug}`);
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

                    <button
                        onClick={handleBack}
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

                    </button>

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
                        py-8
                        px-8
                    "
                >

                    <PhoneFrame>

                        <MenuView
                            menu={menu}
                            preview={true}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />

                    </PhoneFrame>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-50">

            <MenuView
                menu={menu}
                preview={false}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

        </div>

    );
  }

  export default Menu;
