import { Search, GripVertical } from "lucide-react";

import { Card, Input, Button } from "../ui";

function CategoryFilters({
  search,
  onSearchChange,
  onReorder,
}) {
  return (
    <Card className="p-5 mb-6">

      <div className="flex flex-col gap-4 md:flex-row">

        <div className="flex-1">

          <Input
            value={search}
            onChange={onSearchChange}
            placeholder="Buscar categoría..."
            icon={<Search size={18} />}
          />

        </div>

        <Button
          variant="secondary"
          icon={<GripVertical size={18} />}
          onClick={onReorder}
          className="w-full md:w-auto"
        >
          Arrastrar para reordenar
        </Button>

      </div>

    </Card>
  );
}

export default CategoryFilters;
