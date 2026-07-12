import { UtensilsCrossed } from "lucide-react";

function MenuHero({ restaurant, preview = false }) {

    return (

        <header
            className={`
                relative
                bg-gradient-to-br
                from-[#000020]
                via-[#17172b]
                to-[#5a2416]
                px-6
                ${
                    preview
                        ? "pt-18 pb-14"
                        : "pt-16 pb-16"
                }
                text-center
                text-white
            `}
        >

            <div className="mx-auto
        flex
        flex-col
        items-center">

                <div className="space-y-3 text-[#fc4b08] mb-2">

                    <h1 className={`
                                    font-bold
                                    tracking-tight
                                    ${
                                        preview
                                            ? "text-3xl"
                                            : "text-4xl"
                                    }
                                `}>
                        {restaurant.nombre}
                    </h1>

                </div>

                <p className="mt-3 text-sm text-slate-200">
                    Bienvenido a nuestro menú digital
                </p>

            </div>

            <div
                className={`
                            absolute
                            -bottom-8
                            left-1/2
                            flex
                            -translate-x-1/2
                            items-center
                            justify-center
                            rounded-full
                            border-4
                            border-white
                            bg-[#fc4b08]
                            shadow-lg

                            ${
                                preview
                                    ? "h-16 w-16"
                                    : "h-18 w-18"
                            }
                        `}
            >

                <UtensilsCrossed
                    size={
                        preview
                            ? 26
                            : 30
                    }
                    className="text-white"
                />

            </div>

        </header>

    );

}

export default MenuHero;