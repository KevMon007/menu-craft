import { Card } from "../ui";
import CategoryRow from "./CategoryRow";

function CategoryTable({
  categories,
  onEdit,
}) {
  return (
    <Card className="overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50 border-b">

          <tr className="text-left text-sm text-gray-500">

            <th className="px-6 py-4">Orden</th>
            <th className="px-6 py-4">Categoría</th>
            <th className="px-6 py-4">Platillos</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4">Protegida</th>
            <th className="px-6 py-4">Acciones</th>
            <th className="px-6 py-4">Visible</th>

          </tr>

        </thead>

        <tbody>

          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={onEdit}
            />
          ))}

        </tbody>

      </table>

    </Card>
  );
}

export default CategoryTable;