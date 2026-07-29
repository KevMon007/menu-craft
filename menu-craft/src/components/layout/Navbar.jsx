import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Logo.png";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const restaurantName = user?.nombre_restaurante || "Restaurante";

  return (
    <header
    className="
        h-20
        bg-[#1F1D36]
        border-b
        border-[#2E2C47]
        flex
        items-center
        justify-center
        px-4
        md:px-10
        relative
    "
>

    <button
        type="button"
        onClick={onMenuClick}
        className="
            absolute
            left-4
            z-50
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-gray-200
            transition
            hover:bg-[#2A2843]
            hover:text-white
            md:hidden
        "
        aria-label="Abrir menú"
    >
        <Menu size={24} />
    </button>

    <img
        src={logo}
        alt="MenuCraft"
        className="absolute right-4 h-11 w-auto object-contain md:hidden"
    />

    <div className="text-center">

        <p className="text-2xl font-bold text-white md:text-3xl">

            {restaurantName}

        </p>

    </div>

</header>
  );
}

export default Navbar;
