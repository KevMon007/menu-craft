import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui";

function ProductRow({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">

      <td className="px-4 py-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-14 h-14 rounded-lg object-cover"
        />
      </td>

      <td className="px-4 py-4 font-medium">
        {product.name}
      </td>

      <td className="px-4 py-4">
        {product.category}
      </td>

      <td className="px-4 py-4">
        ${product.price}
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
              product.available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {product.available
            ? "Disponible"
            : "No disponible"}
        </span>

      </td>

      <td className="px-4 py-4">

        <div className="flex gap-2">

        <Button
            variant="ghost"
            icon={<Pencil size={18}/>}
            onClick={() => onEdit(product)}
        />

        <Button
            variant="ghost"
            icon={<Trash2 size={18}/>}
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
        />

        </div>

      </td>

    </tr>
  );
}

export default ProductRow;