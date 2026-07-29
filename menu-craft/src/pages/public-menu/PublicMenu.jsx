import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import MenuView from "../../components/menu/MenuView";
import { PageHeader } from "../../components/shared";
import { Card, Button } from "../../components/ui";
import PhoneFrame from "../../components/menu/PhoneFrame";
import QRCodeCard from "../../components/menu/QRCodeCard";
import { API_BASE_URL } from "../../services/api";

function PublicMenu() {

    const { user } = useAuth();

    const restaurantSlug = user?.slug;
    const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;
    const menuUrl = restaurantSlug ? `${APP_URL}/menu/${restaurantSlug}?source=qr` : "";

    const [menu, setMenu] = useState(null);

    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("all");

    const [error, setError] = useState(null);

    const handlePreview = () => {

        window.open(
            `/menu/${restaurantSlug}?preview=true`,
            "_blank"
        );

    };

    useEffect(() => {

        async function loadMenu() {

            if (!restaurantSlug) {

                setMenu(null);

                setError(
                    "No se encontró el slug del restaurante."
                );

                setLoading(false);

                return;

            }

            setLoading(true);

            setError(null);

            try {

                const res = await fetch(
                    `${API_BASE_URL}/api/menu/${restaurantSlug}`
                );

                const data = await res.json();

                if (!res.ok) {

                    setError(
                        data?.error || "Restaurante no encontrado"
                    );

                    setLoading(false);

                    return;

                }

                setMenu(data);

            } catch {

                setError(
                    "Error de red, intenta de nuevo"
                );

            } finally {

                setLoading(false);

            }

        }

        loadMenu();

    }, [restaurantSlug]);

    if (loading) {

        return (
            <div className="flex justify-center py-20">

                Cargando vista previa...

            </div>
        );

    }

    if (error || !menu) {

        return (
            <div className="flex justify-center py-20 text-red-500">

                {error || "No fue posible cargar el menú."}

            </div>
        );

    }

    return (

        <div>

            <PageHeader
                title="Menú Público"
                description="Visualiza y administra la publicación de tu menú digital."
            />

            <div
                className="
                    mt-6
                    grid
                    items-start
                    gap-5
                    md:mt-8
                    lg:grid-cols-[360px_1fr]
                    xl:grid-cols-[380px_1fr]
                "
            >

                {/* Columna izquierda */}

                <div className="space-y-6">

                    <Card className="p-5 md:p-8">

                        <div className="space-y-4">

                            <div className="flex items-center gap-3">

                                <Globe className="text-orange-500" />

                                <h2 className="text-xl font-semibold">

                                    Estado del menú

                                </h2>

                            </div>

                            <span
                                className="
                                    inline-flex
                                    rounded-full
                                    bg-green-100
                                    px-3
                                    py-1
                                    text-sm
                                    font-medium
                                    text-green-700
                                "
                            >

                                Publicado

                            </span>

                            <p className="text-gray-500">

                                Tu menú está disponible para clientes mediante enlace público y código QR.

                            </p>

                        </div>

                    </Card>

                    <QRCodeCard menuUrl={menuUrl} />

                </div>

                {/* Columna derecha */}

                <Card className="h-full p-5 md:p-8">

                    <div className="mb-6 text-center md:mb-8">

                        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">

                            Vista previa del menú

                        </h2>

                        <p className="mt-2 text-gray-500">

                            Así visualizarán el menú los clientes al escanear el código QR.

                        </p>

                    </div>

                    <div className="flex justify-center">

                        <PhoneFrame>

                            <MenuView
                                menu={menu}
                                preview={true}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />

                        </PhoneFrame>

                    </div>

                    <div className="mt-6 flex justify-center md:mt-8">

                        <Button
                            onClick={handlePreview}
                            className="w-full sm:w-auto"
                        >

                            Abrir en una nueva pestaña

                        </Button>

                    </div>

                </Card>

            </div>

        </div>

    );

}

export default PublicMenu;
