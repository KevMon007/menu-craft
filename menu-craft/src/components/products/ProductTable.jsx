import ProductRow from "./ProductRow";
import { Card } from "../ui";

function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <Card className="overflow-hidden p-4">
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
            />

          ))}

        </tbody>

      </table>
    </Card>
  );
}

export default ProductTable;