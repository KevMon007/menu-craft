import { UtensilsCrossed } from "lucide-react";

function MenuHero({ restaurant }) {

    return (

        <header
            className="
                relative
                bg-gradient-to-br
from-[#000020]
via-[#17172b]
to-[#5a2416]
                px-6
                pt-16
                pb-16   
                text-center
                text-white
            "
        >

            <div className="mx-auto
        flex
        flex-col
        items-center">

                <div className="flex items-center justify-center gap-2 text-[#fc4b08] mb-2">

                    <h1 className="text-3xl font-bold">
                        {restaurant.nombre}
                    </h1>

                </div>

                <p className="mt-3 text-sm text-slate-200">
                    Bienvenido a nuestro menú digital
                </p>

            </div>

            <div
                className="
                    absolute
                    -bottom-8
                    left-1/2
                    flex
                    h-16
                    w-16
                    -translate-x-1/2
                    items-center
                    justify-center
                    rounded-full
                    border-4
                    border-white
                    bg-[#fc4b08]
                    shadow-lg
                "
            >

                <UtensilsCrossed
                    size={28}
                    className="text-white"
                />

            </div>

        </header>

    );

}

export default MenuHero;