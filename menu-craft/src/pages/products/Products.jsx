import { useState } from "react";
import { PageHeader } from "../../components/shared";

import ProductStats from "../../components/products/ProductStats";
import ProductFilters from "../../components/products/ProductFilters";
import ProductTable from "../../components/products/ProductTable";

import burger from "../../assets/burger.jpg";
import salad from "../../assets/salad.jpg";
import lemonade from "../../assets/lemonade.jpg";

function Products() {

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [status, setStatus] = useState("");

  const stats = {
    total: 10,
    available: 8,
    unavailable: 2,
  };

  const categories = [
    {
      id: 1,
      name: "Entradas",
    },
    {
      id: 2,
      name: "Platillos fuertes",
    },
    {
      id: 3,
      name: "Postres",
    },
    {
      id: 4,
      name: "Bebidas",
    },
  ];

  const handleCreateProduct = () => {
    console.log("Abrir modal");
  };

  const products = [
    {
    id:1,
    image: burger,
    name:"Hamburguesa",
    category:"Fuertes",
    price:180,
    available:true
    },

    {
    id:2,
    image: salad,
    name:"Ensalada César",
    category:"Entradas",
    price:120,
    available:true
    },

    {
    id:3,
    image: lemonade,
    name:"Limonada",
    category:"Bebidas",
    price:45,
    available:false
    }

    ];

  return (
    <div>

      <PageHeader
        title="Gestión de Platillos"
        description="Administra todos los platillos disponibles en tu menú."
        buttonText="Nuevo platillo"
        onAction={handleCreateProduct}
      />

      <ProductStats
        stats={stats}
      />

      <ProductFilters
        search={search}
        category={category}
        status={status}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
      />

      <ProductTable
          products={products}
          onEdit={(product)=>console.log(product)}
          onDelete={(id)=>console.log(id)}
      />
    </div>
  );
}

export default Products;