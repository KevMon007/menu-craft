import { UtensilsCrossed } from "lucide-react";

function MenuHero({ restaurant }) {

    return (

        <header className="bg-white shadow-sm border-b border-gray-200">

            <div className="max-w-2xl mx-auto px-4 py-6 text-center">

                <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">

                    <UtensilsCrossed size={24} />

                    <h1 className="text-2xl font-bold text-slate-900">

                        {restaurant.nombre}

                    </h1>

                </div>

                <p className="text-gray-500 text-sm">

                    Nuestro menú

                </p>

            </div>

        </header>

    );

}

export default MenuHero;