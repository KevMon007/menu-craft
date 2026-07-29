import { Card } from "../ui";

import CategoryRow from "./CategoryRow";

function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  return (
    <Card className="overflow-hidden">

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
  );
}

export default CategoryTable;
