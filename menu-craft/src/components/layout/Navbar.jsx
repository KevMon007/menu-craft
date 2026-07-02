function Navbar({
  title = "Dashboard",
  subtitle = "Bienvenido a MenuCraft",
}) {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {title}
        </h1>

        <p className="text-gray-500 text-sm">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">
          <p className="font-semibold">
            Restaurante Demo
          </p>

          <p className="text-sm text-gray-500">
            Administrador
          </p>
        </div>

        <div className="h-11 w-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
          R
        </div>

      </div>

    </header>
  );
}

export default Navbar;