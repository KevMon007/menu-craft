import { Pencil, Trash2 } from "lucide-react";

import ProductRow from "./ProductRow";
import { Card } from "../ui";

function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  return (
    <>
    <Card className="hidden overflow-hidden p-4 md:block">
      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="text-left px-4 py-3">
              Imagen
            </th>

            <th className="text-left px-4 py-3">
              Nombre
            </th>

            <th className="text-left px-4 py-3">
              Categoría
            </th>

            <th className="text-left px-4 py-3">
              Precio
            </th>

            <th className="text-left px-4 py-3">
              Estado
            </th>

            <th className="text-left px-4 py-3">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <ProductRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />

          ))}

        </tbody>

      </table>
    </Card>

    <div className="space-y-4 md:hidden">
      {products.map((product) => (
        <ProductMobileCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
    </>
  );
}

function ProductMobileCard({
  product,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const isAvailable = product.disponible !== false;

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <img
          src={product.url_foto || undefined}
          alt={product.nombre}
          className="h-20 w-20 shrink-0 rounded-xl border object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-800">
                {product.nombre}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {product.categoria_nombre}
              </p>
            </div>

            <span className="shrink-0 font-bold text-orange-600">
              ${product.precio}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAvailable ? "Disponible" : "No disponible"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onToggleStatus(product)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            isAvailable ? "bg-green-500" : "bg-gray-300"
          }`}
          aria-label={isAvailable ? "Marcar platillo como no disponible" : "Marcar platillo como disponible"}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              isAvailable ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-orange-600"
            aria-label="Editar platillo"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
            aria-label="Eliminar platillo"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ProductTable;
