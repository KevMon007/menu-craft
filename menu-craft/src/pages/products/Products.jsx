import { useEffect, useState } from "react";
import { PageHeader } from "../../components/shared";
import { Modal, Button } from "../../components/ui";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { uploadProductImage } from "../../services/uploadService";

import ProductStats from "../../components/products/ProductStats";
import ProductFilters from "../../components/products/ProductFilters";
import ProductTable from "../../components/products/ProductTable";
import ProductForm from "../../components/products/ProductForm";

function Products() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const stats = {

      total: products.length,

      available: products.filter(
          p => p.disponible
      ).length,

      unavailable: products.filter(
          p => !p.disponible
      ).length,

  };
  const [values, setValues] = useState({
    nombre: "",
    categoria_id: "",
    descripcion: "",
    precio: "",
    url_foto: "",
    disponible: true,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const handleSubmit = async () => {

    try {

      if (!values.nombre.trim()) {
        alert("El nombre del platillo es obligatorio.");
        return;
      }

      if (!values.categoria_id) {
        alert("Selecciona una categoría.");
        return;
      }

      if (!values.precio || Number(values.precio) < 0) {
        alert("El precio debe ser mayor o igual a 0.");
        return;
      }

      let imageUrl = values.url_foto;
      if (selectedImage) {

          try {

              setIsUploadingImage(true);

              setImageUploadError("");

              const upload = await uploadProductImage(selectedImage);

              imageUrl = upload.url_foto;

          } catch (error) {

              setImageUploadError(error.message);

              return;

          } finally {

              setIsUploadingImage(false);

          }

      }

      const payload = {
          nombre: values.nombre.trim(),
          categoria_id: Number(values.categoria_id),
          descripcion: values.descripcion.trim(),
          precio: Number(values.precio),
          url_foto: imageUrl,
          disponible: values.disponible,
      };

      if (editingProduct) {

        await updateProduct(editingProduct.id, payload);

      } else {

        await createProduct(payload);

      }

      await loadProducts();

      handleCloseModal();

    } catch (error) {

      console.error("Error al guardar platillo:", error);

    }

  };

  const loadCategories = async () => {

    try {

      const data = await getCategories();

      setCategories(data);

    } catch (error) {

      console.error(error);

    }

  };

  const handleChange = (e) => {

      const { name, value } = e.target;

      setValues((prev) => ({
          ...prev,
          [name]: value,
      }));

  };

  const loadProducts = async () => {

    try {

        const data = await getProducts();

        setProducts(data);

    } catch(error){

        console.error(error);

    }

  };

  const confirmDelete = async () => {

      await deleteProduct(productToDelete.id);

      await loadProducts();

      setDeleteModalOpen(false);

  };

  const handleCreateProduct = () => {

      setEditingProduct(null);

      setValues({
          nombre: "",
          categoria_id: "",
          descripcion: "",
          precio: "",
          url_foto: "",
          disponible: true,
      });

      setIsModalOpen(true);

  };

  const handleEdit = (product) => {

      setEditingProduct(product);

      setValues({

          nombre: product.nombre,

          categoria_id: product.categoria_id,

          descripcion: product.descripcion || "",

          precio: product.precio,

          url_foto: product.url_foto || "",

          disponible: product.disponible,

      });

      setPreviewImage(product.url_foto || "");
      setSelectedImage(null);

      setIsModalOpen(true);

  };

  const handleDelete = (product) => {

      setProductToDelete(product);

      setDeleteModalOpen(true);

  };

  const cancelDelete = () => {

      setDeleteModalOpen(false);

      setProductToDelete(null);

  };

  const handleCloseModal = () => {

    setValues({
      nombre: "",
      categoria_id: "",
      descripcion: "",
      precio: "",
      url_foto: "",
      disponible: true,
    });

    setEditingProduct(null);

    setIsModalOpen(false);

    setSelectedImage(null);
    setPreviewImage("");
    setImageUploadError("");

  };

  const handleImageChange = (e) => {

    setImageUploadError("");
    const file = e.target.files[0];

      if (!file) return;

      setSelectedImage(file);

      setPreviewImage(
          URL.createObjectURL(file)
      );

  };

  useEffect(() => {

      loadProducts();

      loadCategories();

  }, []);

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
          onEdit={handleEdit}
          onDelete={handleDelete}
      />

      <Modal
        open={isModalOpen}
        title={
          editingProduct
            ? "Editar platillo"
            : "Nuevo platillo"
        }
        onClose={handleCloseModal}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isUploadingImage}
            >
              Cancelar
            </Button>

            <Button
              form="product-form"
              type="submit"
              disabled={isUploadingImage}
            >
              {
                  isUploadingImage
                      ? "Cargando imagen..."
                      : editingProduct
                          ? "Actualizar"
                          : "Guardar"
              }
            </Button>
          </>
        }
      >

        <ProductForm
            values={values}
            categories={categories}
            previewImage={previewImage}
            onImageChange={handleImageChange}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isUploadingImage={isUploadingImage}
            imageUploadError={imageUploadError}
        />

      </Modal>

      <Modal
          open={deleteModalOpen}
          title="Eliminar platillo"
          onClose={cancelDelete}
          size="sm"
          footer={
              <>
                  <Button
                      variant="secondary"
                      onClick={cancelDelete}
                  >
                      Cancelar
                  </Button>

                  <Button
                      variant="danger"
                      onClick={confirmDelete}
                  >
                      Eliminar
                  </Button>
              </>
          }
      >

          <p className="text-gray-600">

              ¿Seguro que deseas eliminar el platillo{" "}

              <strong>

                  {productToDelete?.nombre}

              </strong>

              ?

          </p>

      </Modal>


    </div>
  );
}

export default Products;