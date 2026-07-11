import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

function Navbar() {
  const location = useLocation();

  const pages = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Resumen general de tu restaurante",
    },

    "/categories": {
      title: "Categorías",
      subtitle: "Organiza los platillos de tu menú",
    },

    "/products": {
      title: "Platillos",
      subtitle: "Administra los platillos de tu restaurante",
    },
  };

  const currentPage =
    pages[location.pathname] || {
        title: "MenuCraft",
        subtitle: "",
    };

  return (
    <header
    className="
        h-20
        bg-[#1F1D36]
        border-b
        border-[#2E2C47]
        flex
        items-center
        justify-between
        px-10
    "
>

    <div>

        <h1 className="text-xl font-semibold text-white">

            {currentPage.title}

        </h1>

        <p className="text-sm text-gray-300 mt-1">

            {currentPage.subtitle}

        </p>

    </div>

    <div className="flex items-center gap-6">

        <button
            className="
                relative
                rounded-lg
                p-2
                text-gray-300
                hover:bg-[#2A2843]
                hover:text-white
                transition
            "
        >

            <Bell size={20}/>

            <span
                className="
                    absolute
                    -top-1
                    -right-1
                    h-4
                    w-4
                    rounded-full
                    bg-orange-500
                    text-[10px]
                    text-white
                    flex
                    items-center
                    justify-center
                "
            >
                3
            </span>

        </button>

        <div className="text-right">

            <p className="font-medium text-white">

                Restaurante Demo

            </p>

            <p className="text-xs text-gray-400">

                Administrador

            </p>

        </div>

        <div
            className="
                h-10
                w-10
                rounded-full
                bg-orange-500
                text-white
                flex
                items-center
                justify-center
                font-semibold
            "
        >
            R
        </div>

    </div>

</header>
  );
}

export default Navbar;