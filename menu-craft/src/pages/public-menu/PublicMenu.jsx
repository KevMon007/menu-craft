import { useNavigate } from "react-router-dom";
import { Eye, Globe } from "lucide-react";

import { PageHeader } from "../../components/shared";
import { Card, Button } from "../../components/ui";

function PublicMenu() {

    const navigate = useNavigate();

    const restaurantSlug = localStorage.getItem("restaurantSlug");

    const handlePreview = () => {

        navigate(`/menu/${restaurantSlug}?preview=true`);

    };

    return (

        <div>

            <PageHeader
                title="Menú Público"
                description="Visualiza el menú exactamente como lo verán tus clientes."
            />

            <Card className="p-8">

                <div className="space-y-3">

                    <div className="flex items-center gap-3">

                        <Eye className="text-orange-500" />

                        <h2 className="text-xl font-semibold">

                            Vista previa

                        </h2>

                    </div>

                    <p className="text-gray-500">

                        Antes de compartir el código QR puedes revisar cómo se mostrará tu menú público.

                    </p>

                    <Button
                        onClick={handlePreview}
                    >

                        Ver menú público

                    </Button>

                </div>

            </Card>

            <Card className="p-8 mt-6">

                <div className="space-y-3">

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

                        Próximamente podrás activar o desactivar la publicación del menú desde este apartado.

                    </p>

                </div>

            </Card>

        </div>

    );

}

export default PublicMenu;