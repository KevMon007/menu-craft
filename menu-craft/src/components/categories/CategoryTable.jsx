import { Pencil, Trash2 } from "lucide-react";

import { Card } from "../ui";

import CategoryRow from "./CategoryRow";

function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  return (
    <>
    <Card className="hidden overflow-hidden md:block">

      <table className="w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left">
              Orden
            </th>

            <th className="px-6 py-4 text-left">
              Nombre
            </th>

            <th className="px-6 py-4 text-left">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}

        </tbody>

      </table>

    </Card>

    <div className="space-y-4 md:hidden">
      {categories.map((category) => (
        <CategoryMobileCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
    </>
  );
}

function CategoryMobileCard({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const isActive = category.activa !== false;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-800">
            {category.nombre}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Orden: {category.orden}
          </p>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isActive ? "Activa" : "Inactiva"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onToggleStatus(category)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            isActive ? "bg-green-500" : "bg-gray-300"
          }`}
          aria-label={isActive ? "Desactivar categoría" : "Activar categoría"}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-orange-600"
          aria-label="Editar categoría"
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(category)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
          aria-label="Eliminar categoría"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
}

export default CategoryTable;
