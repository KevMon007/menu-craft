import {
  Input,
  Select,
  Textarea,
} from "../ui";

function ProductForm({
    values,
    categories,
    previewImage,
    onImageChange,
    onChange,
    onSubmit,
}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (

    <form
      id="product-form"
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      <Input
        label="Nombre del platillo"
        name="nombre"
        value={values.nombre}
        onChange={onChange}
        placeholder="Ej. Hamburguesa BBQ"
      />

      <Select
        label="Categoría"
        name="categoria_id"
        value={values.categoria_id}
        onChange={onChange}
        options={categories}
        valueKey="id"
        labelKey="nombre"
        placeholder="Selecciona una categoría"
      />

      <Textarea
        label="Descripción"
        name="descripcion"
        value={values.descripcion}
        onChange={onChange}
        placeholder="Describe el platillo..."
        rows={4}
      />

      <Input
        label="Precio"
        name="precio"
        type="number"
        value={values.precio}
        onChange={onChange}
        placeholder="180.00"
      />

      <div className="space-y-2">

          <label
              className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
              "
          >
              Imagen
          </label>

          <div className="space-y-3">

              <label
                  htmlFor="product-image"
                  className="
                      flex
                      cursor-pointer
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border-2
                      border-dashed
                      border-orange-300
                      bg-orange-50
                      px-4
                      py-6
                      text-sm
                      font-medium
                      text-orange-600
                      transition
                      hover:bg-orange-100
                  "
              >

                  📷

                  Seleccionar imagen

              </label>

              <input
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={onImageChange}
              />

          </div>
          
          {
              previewImage && (

                  <img
                      src={previewImage}
                      alt="Vista previa"
                      className="
                          mt-4
                          h-40
                          w-full
                          rounded-xl
                          border
                          object-cover
                      "
                  />

              )
          }

      </div>

      <div className="flex items-center gap-3">

        <input
          id="disponible"
          name="disponible"
          type="checkbox"
          checked={values.disponible}
          onChange={(e) =>
            onChange({
              target: {
                name: "disponible",
                value: e.target.checked,
              },
            })
          }
          className="h-4 w-4 rounded border-gray-300"
        />

        <label
          htmlFor="disponible"
          className="text-sm text-gray-700"
        >
          Disponible
        </label>

      </div>

    </form>

  );

}

export default ProductForm;