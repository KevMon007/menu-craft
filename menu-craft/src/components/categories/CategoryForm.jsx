import { Input } from "../ui";

function CategoryForm({
  values,
  onChange,
  onSubmit
}) {

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

  return (

    <form
        id="category-form"
        onSubmit={handleSubmit}
        className="space-y-5"
    >

      <Input
        label="Nombre"
        name="nombre"
        value={values.nombre}
        onChange={onChange}
        placeholder="Ej. Bebidas"
      />

      <Input
        label="Orden"
        name="orden"
        type="number"
        value={values.orden}
        onChange={onChange}
        placeholder="1"
      />

    </form>

  );
}

export default CategoryForm;