import { Pencil, Trash2 } from "lucide-react";

import { Button } from "../ui";

function CategoryRow({
  category,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">

      <td className="px-6 py-4">

        {category.orden}

      </td>

      <td className="px-6 py-4 font-medium text-slate-700">

        {category.nombre}

      </td>

      <td className="px-6 py-4">

        <div className="flex items-center gap-2">

          <Button
            variant="ghost"
            icon={<Pencil size={16} />}
            onClick={() => onEdit(category)}
          />

          <Button
            variant="ghost"
            icon={<Trash2 size={16} />}
            className="text-red-600 hover:bg-red-50"
            onClick={() => onDelete(category)}
          />

        </div>

      </td>

    </tr>
  );
}

export default CategoryRow;