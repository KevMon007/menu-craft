import {
  Input,
  Select,
  Textarea,
} from "../ui";

function ProductForm({
  values,
  categories,
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

      <Input
        label="URL de la imagen"
        name="url_foto"
        value={values.url_foto}
        onChange={onChange}
        placeholder="https://..."
      />

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