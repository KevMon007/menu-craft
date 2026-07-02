import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  QrCode,
  ChartColumn,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b">
        <h1 className="text-2xl font-bold text-orange-500">
          MenuCraft
        </h1>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6">

        <ul className="space-y-2">

          <li>
            <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-orange-100 transition">
              <LayoutDashboard size={20} />
              Dashboard
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-orange-100 transition">
              <UtensilsCrossed size={20} />
              Platillos
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-orange-100 transition">
              <FolderOpen size={20} />
              Categorías
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-orange-100 transition">
              <QrCode size={20} />
              Menú Público
            </button>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-orange-100 transition">
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

        <button className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-red-500 hover:bg-red-100 transition">
          <LogOut size={20} />
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;