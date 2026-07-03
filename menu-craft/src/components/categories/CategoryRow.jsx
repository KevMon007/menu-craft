import { Badge, Button } from "../ui";
import {
  Pencil,
  Lock,
} from "lucide-react";

function CategoryRow({
  category,
  onEdit,
}) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">

      {/* Orden */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <span className="text-gray-400">
            ⋮⋮
          </span>

          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">
            {category.order}
          </span>

        </div>

      </td>

      {/* Información */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-xl">

            {category.icon}

          </div>

          <div>

            <h3 className="font-semibold text-gray-800">

              {category.name}

            </h3>

            <p className="text-sm text-gray-500">

              {category.description}

            </p>

          </div>

        </div>

      </td>

      {/* Platillos */}

      <td className="px-6">

        <Badge variant="warning">
            {category.products} platillos
        </Badge>

      </td>

      {/* Estado */}

      <td className="px-6">

        <Badge variant={category.active ? "success" : "danger"}>
          {category.active ? "Activa" : "Inactiva"}
        </Badge>

      </td>

      {/* Protegida */}

      <td className="px-6">

        {category.protected && (

          <Lock size={16} className="text-gray-400" />

        )}

      </td>

      {/* Editar */}

      <td className="px-6">

        <Button
        variant="ghost"
        icon={<Pencil size={16} />}
        onClick={() => onEdit(category)}
        >
        Editar
        </Button>

      </td>

      {/* Switch */}

      <td className="px-6">

        <input
          type="checkbox"
          checked={category.active}
          readOnly
        />

      </td>

    </tr>
  );
}

export default CategoryRow;