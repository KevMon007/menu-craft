import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui";

function ProductRow({
  product,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const isAvailable = product.disponible !== false;

  return (
    <tr className="border-b hover:bg-gray-50 transition">

      <td className="px-4 py-4">
        <img
          src={product.url_foto || undefined}
          alt={product.nombre}
          className="w-14 h-14 rounded-lg object-cover"
        />
      </td>

      <td className="px-4 py-4 font-medium">
        {product.nombre}
      </td>

      <td className="px-4 py-4">
        {product.categoria_nombre}
      </td>

      <td className="px-4 py-4">
        ${product.precio}
      </td>

      <td className="px-4 py-4">

        <span
          className={`
            px-3
            py-1
            rounded-full
            text-sm
            font-medium

            ${
              isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {isAvailable
            ? "Disponible"
            : "No disponible"}
        </span>

      </td>

      <td className="px-4 py-4">

        <div className="flex items-center gap-2">

        <button
            type="button"
            onClick={() => onToggleStatus(product)}
            className={`
              relative
              h-6
              w-11
              rounded-full
              transition-colors
              ${isAvailable ? "bg-green-500" : "bg-gray-300"}
            `}
            aria-label={isAvailable ? "Marcar platillo como no disponible" : "Marcar platillo como disponible"}
            title={isAvailable ? "Platillo disponible" : "Platillo no disponible"}
        >
            <span
              className={`
                absolute
                left-0.5
                top-0.5
                h-5
                w-5
                rounded-full
                bg-white
                shadow
                transition-transform
                ${isAvailable ? "translate-x-5" : "translate-x-0"}
              `}
            />
        </button>

        <Button
            variant="ghost"
            icon={<Pencil size={18}/>}
            onClick={() => onEdit(product)}
        />

        <Button
            variant="ghost"
            icon={<Trash2 size={18}/>}
            onClick={() => onDelete(product)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
        />

        </div>

      </td>

    </tr>
  );
}

export default ProductRow;
