import { useState } from "react";
import { PageHeader } from "../../components/shared";

import CategoryStats from "../../components/categories/CategoryStats";
import CategoryFilters from "../../components/categories/CategoryFilters";
import CategoryTable from "../../components/categories/CategoryTable";

function Categories() {

  const [search, setSearch] = useState("");

  const stats = {
    total: 7,
    active: 6,
    inactive: 1,
    products: 47,
  };

  const categories = [
  {
    id: 1,
    nombre: "Entradas",
    orden: 1,
  },
  {
    id: 2,
    nombre: "Platillos Fuertes",
    orden: 2,
  },
  {
    id: 3,
    nombre: "Postres",
    orden: 3,
  },
];

  const handleEditCategory = (category) => {
    console.log(category);
  };

  const handleCreateCategory = () => {
    console.log("Abrir modal");
  };

  return (
    <div>

      <PageHeader
        title="Categorías"
        description="Organiza los platillos de tu menú mediante categorías personalizadas."
        buttonText="Nueva categoría"
        onAction={handleCreateCategory}
      />

      <CategoryStats stats={stats} />

      <CategoryFilters
        search={search}
        onSearchChange={setSearch}
      />

      <CategoryTable
        categories={categories}
        onEdit={handleEditCategory}
      />

    </div>
  );
}

export default Categories;