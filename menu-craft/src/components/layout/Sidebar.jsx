import { LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  QrCode,
  ChartColumn,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { useAuth } from "../../context/AuthContext"; // Importamos el contexto

function Sidebar() {
  const restaurantSlug = localStorage.getItem("restaurantSlug");
  const navigate = useNavigate();
  const { logout } = useAuth(); //  Extraemos el método logout global

  const handleLogout = () => {
      logout(); // Esto borra el token de localStorage y limpia el estado global de React
      localStorage.removeItem("restaurantSlug");

      navigate("/login", {
          replace: true,
      });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div
        className="h-20 px-6 flex items-center
          gap-3
          bg-[#1F1D36]
          border-b
          border-[#2E2C47]
        "
      >

        <img
          src={logo}
          alt="MenuCraft"
          className="h-14 w-auto object-contain"
        />

        <h1 className="text-2xl font-bold tracking-tight text-white">
          MenuCraft
        </h1>

      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6">

        <ul className="space-y-2">

          <li>
            <NavLink
                to="/dashboard"
                className={({isActive})=>

                    `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-4
                    py-3
                    transition

                    ${
                        isActive
                        ? "bg-orange-50 border-l-4 border-orange-500 text-orange-600 font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }
                    `
                }
            >
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/products"
              className={({isActive})=>

                `
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                transition

                ${
                    isActive
                      ? "bg-orange-50 border-l-4 border-orange-500 text-orange-600 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                }
                `
              }
            >
              <UtensilsCrossed size={20} />
              Platillos
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/categories"
              className={({isActive})=>

                `
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                transition

                ${
                    isActive
                      ? "bg-orange-50 border-l-4 border-orange-500 text-orange-600 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                }
                `
              }
            >
              <FolderOpen size={20} />
              Categorías
            </NavLink>
          </li>

          <li>
            <NavLink
              to={`/menu/${restaurantSlug}`}
              className={({isActive})=>

                `
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                transition

                ${
                    isActive
                        ? "bg-orange-50 border-l-4 border-orange-500 text-orange-600 font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                }
                `
              }
            >
              <QrCode size={20} />
              Menú Público
            </NavLink>
          </li>

          <li>
            <button
              onClick={() => alert("Próximamente")}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100 transition"
            >
              <ChartColumn size={20} />
              Estadísticas
            </button>
          </li>

        </ul>

      </nav>

      {/* Parte inferior */}
      <div className="border-t p-4 space-y-2">

        <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100 transition">
          <Settings size={20} />
          Configuración
        </button>

        <button
           onClick={handleLogout}
           className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-red-500 hover:bg-red-100 transition">
          <LogOut size={20} />
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
