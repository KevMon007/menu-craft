import { UtensilsCrossed } from "lucide-react";

function MenuHero({ restaurant }) {

    return (

        <header
            className="
                bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950
                px-6
                pt-16
                pb-20
                text-center
                text-white
            "
        >

            <div className="max-w-2xl mx-auto">

                <div className="flex items-center justify-center gap-2 text-orange-500 mb-2">

                    <h1 className="text-3xl font-bold">
                        {restaurant.nombre}
                    </h1>

                </div>

                <p
                    className=" 
                        mt-2
                        text-sm
                        text-slate-300
                    "
                >
                    Nuestro menú
                </p>

            </div>

        </header>

    );

}

export default MenuHero;