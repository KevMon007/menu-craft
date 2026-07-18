import { Card, Input, Select } from "../ui";
import { Search } from "lucide-react";

function ProductFilters({
  search,
  category,
  status,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}) {

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const statusOptions = [
    {
        value: "available",
        label: "Disponible",
    },
    {
        value: "unavailable",
        label: "No disponible",
    },
  ];  

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="md:col-span-2">

            <Input
                value={search}
                placeholder="Buscar platillo..."
                icon={<Search size={18}/>}
                onChange={onSearchChange}
            />

        </div>

        <Select
        value={category}
        onChange={onCategoryChange}
        options={categoryOptions}
        placeholder="Todas las categorías"
        />

        <Select
            value={status}
            onChange={onStatusChange}
            options={statusOptions}
            placeholder="Todos los estados"
        />

      </div>
    </Card>
  );
}

export default ProductFilters;