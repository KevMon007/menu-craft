import { LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  QrCode,
  ChartColumn,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ open = false, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
      const confirmed = window.confirm("¿Seguro que deseas cerrar sesión?");

      if (!confirmed) return;

      onClose?.();
      logout();
      navigate("/login", {
          replace: true,
      });
  };

  const handleNavClick = () => {
      onClose?.();
  };

  return (
    <>
    {open && (
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40 md:hidden"
        aria-label="Cerrar menú"
        onClick={onClose}
      />
    )}

    <aside
      className={`
        fixed
        inset-y-0
        left-0
        z-[60]
        flex
        shrink-0
        w-64
        flex-col
        border-r
        border-gray-200
        bg-white
        transform
        transition-transform
        duration-300
        md:static
        md:pointer-events-auto
        md:translate-x-0
        ${open ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"}
      `}
    >

      {/* Logo */}
      <div
        className="h-20 px-6 flex items-center
          justify-center
          gap-3
          bg-[#1F1D36]
          border-b
          border-[#2E2C47]
        "
      >

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-lg text-gray-200 transition hover:bg-[#2A2843] hover:text-white md:hidden"
          aria-label="Cerrar menú"
        >
          <X size={22} />
        </button>

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
                onClick={handleNavClick}
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
              onClick={handleNavClick}
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
              onClick={handleNavClick}
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
              to="/public-menu"
              onClick={handleNavClick}
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
              onClick={() => {
                onClose?.();
                alert("Próximamente");
              }}
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

        <button
          onClick={handleNavClick}
          className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100 transition"
        >
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
    </>
  );
}

export default Sidebar;
