import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import { PageHeader, ConfirmationModal } from "../../components/shared";
import { Modal, Button } from "../../components/ui";

import CategoryStats from "../../components/categories/CategoryStats";
import CategoryFilters from "../../components/categories/CategoryFilters";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryForm from "../../components/categories/CategoryForm";

function Categories() {

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [values, setValues] = useState({
    nombre: "",
    orden: "",
  });
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const stats = {
    total: categories.length,
    active: categories.length,
    inactive: 0,
    products: 0,
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
      try {
          if (!values.nombre.trim()) {
              alert("El nombre es obligatorio");
              return;
          }
          if (Number(values.orden) < 0) {
              alert("El orden debe ser mayor o igual a 0");
              return;
          }
          const payload = {
              nombre: values.nombre,
              orden: Number(values.orden),
          };
          if (editingCategory) {
              await updateCategory(
                  editingCategory.id,
                  payload
              );
          } else {
              await createCategory(payload);
          }
          await loadCategories();
          handleCloseModal();
      } catch (error) {
          console.error(error.message);
      }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {

    setValues({
      nombre: "",
      orden: "",
    });
    setEditingCategory(null);
    setIsModalOpen(false);

  };

  const handleEdit = (category) => {

    setEditingCategory(category);

    setValues({
        nombre: category.nombre,
        orden: category.orden,
    });

    setIsModalOpen(true);

  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error.message);
    }
  };

  const confirmDelete = async () => {

      try {

          await deleteCategory(categoryToDelete.id);

          await loadCategories();

          setCategoryToDelete(null);

      } catch (error) {

          console.error(error);

      }

  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>

      <PageHeader
        title="Categorías"
        description="Organiza los platillos de tu menú mediante categorías personalizadas."
        buttonText="Nueva categoría"
        onAction={handleOpenModal}
      />

      <CategoryStats stats={stats} />

      <CategoryFilters
        search={search}
        onSearchChange={setSearch}
      />

      <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
      />

      <Modal
            open={isModalOpen}
            title={
                editingCategory
                    ? "Editar categoría"
                    : "Nueva categoría"
            }
            onClose={handleCloseModal}

            footer={
                <>
                    <Button
                        variant="secondary"
                        onClick={handleCloseModal}
                    >
                        Cancelar
                    </Button>

                    <Button
                        form="category-form"
                        type="submit"
                    >
                        {editingCategory ? "Actualizar" : "Guardar"}
                    </Button>
                </>
            }
        >

        <CategoryForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />

        </Modal>

        <ConfirmationModal

            open={!!categoryToDelete}

            title="Eliminar categoría"

            message={`¿Seguro que deseas eliminar "${categoryToDelete?.nombre}"?`}

            onClose={() => setDeleteCategory(null)}

            onConfirm={confirmDelete}

        />

    </div>
  );
}

export default Categories;