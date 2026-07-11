import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Trash2, Check, X, LogOut, ExternalLink, Image } from "lucide-react";
import { useNotification } from "../components/ToastNotification"; // Importación del hook

function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_URL || "";

  // Si mandamos un FormData (para la imagen), dejamos que el navegador ponga el Content-Type correcto automáticamente
  const isFormData = options.body instanceof FormData;

  return fetch(`${base}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

function Dashboard() {
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // Inicialización
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState(null);
  const [editCatName, setEditCatName] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [prodForm, setProdForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    imagen_url: "", // Nuevo campo para la url de imagen subida
  });

  async function loadCategories() {
    try {
      const res = await api("/api/categories");
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  async function loadProducts(categoriaId) {
    try {
      const res = await api(`/api/products?categoria_id=${categoriaId}`);
      if (!res.ok) throw new Error("Error al cargar platillos");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);
      await loadCategories();
      setLoading(false);
    }
    init();
  }, []);

  function handleSelectCategory(catId) {
    setSelectedCat(catId);
    if (catId) {
      loadProducts(catId);
    } else {
      setProducts([]);
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    showNotification("Creando categoría...", "info");
    try {
      const res = await api("/api/categories", {
        method: "POST",
        body: JSON.stringify({ nombre: newCatName.trim() }),
      });
      if (!res.ok) throw new Error("Error al crear categoría");
      showNotification("Categoría creada con éxito", "success");
      await loadCategories();
      setNewCatName("");
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  async function handleUpdateCategory(id) {
    if (!editCatName.trim()) return;
    showNotification("Actualizando categoría...", "info");
    try {
      const res = await api(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nombre: editCatName.trim() }),
      });
      if (!res.ok) throw new Error("Error al actualizar categoría");
      showNotification("Categoría actualizada", "success");
      await loadCategories();
      setEditingCat(null);
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  async function handleDeleteCategory(id) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    showNotification("Eliminando categoría...", "info");
    try {
      const res = await api(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar categoría");
      showNotification("Categoría eliminada", "success");
      if (selectedCat === id) handleSelectCategory(null);
      await loadCategories();
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  // --- NUEVA FUNCIÓN: CARGA DE IMAGEN ---
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    setUploadingImage(true);
    showNotification("Subiendo imagen al servidor...", "info");

    try {
      const res = await api("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");
      const data = await res.json();

      setProdForm((f) => ({ ...f, imagen_url: data.url }));
      showNotification("Imagen procesada y subida con éxito", "success");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    const body = {
      nombre: prodForm.nombre.trim(),
      descripcion: prodForm.descripcion.trim(),
      precio: parseFloat(prodForm.precio),
      categoria_id: parseInt(prodForm.categoria_id) || selectedCat,
      imagen_url: prodForm.imagen_url, // Se envía la URL de la imagen
    };

    showNotification(editingProduct ? "Actualizando platillo..." : "Guardando platillo...", "info");

    try {
      if (editingProduct) {
        const res = await api(`/api/products/${editingProduct}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Error al actualizar platillo");
        showNotification("Platillo actualizado correctamente", "success");
      } else {
        const res = await api("/api/products", {
          method: "POST",
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Error al crear platillo");
        showNotification("Platillo agregado al menú", "success");
      }
      await loadProducts(selectedCat);
      resetProductForm();
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  async function handleToggleDisponible(product) {
    showNotification("Cambiando estado...", "info");
    try {
      const res = await api(`/api/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify({ disponible: !product.disponible }),
      });
      if (!res.ok) throw new Error("Error al cambiar disponibilidad");
      showNotification(
        product.disponible ? "Platillo marcado como no disponible" : "Platillo disponible",
        "success"
      );
      await loadProducts(selectedCat);
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm("¿Eliminar este platillo?")) return;
    showNotification("Eliminando platillo...", "info");
    try {
      const res = await api(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar platillo");
      showNotification("Platillo removido", "success");
      await loadProducts(selectedCat);
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  function startEditProduct(product) {
    setEditingProduct(product.id);
    setProdForm({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: product.precio.toString(),
      categoria_id: product.categoria_id.toString(),
      imagen_url: product.imagen_url || "",
    });
    setShowProductForm(true);
  }

  function resetProductForm() {
    setShowProductForm(false);
    setEditingProduct(null);
    setProdForm({ nombre: "", descripcion: "", precio: "", categoria_id: "", imagen_url: "" });
  }

  const slug = localStorage.getItem("restaurantSlug");

  function handleLogout() {
    localStorage.removeItem("token");
    showNotification("Sesión cerrada correctamente", "success");
    navigate("/login", { replace: true });
  }

  const precioValido = prodForm.precio && parseFloat(prodForm.precio) >= 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">MenuCraft</h1>
          <div className="flex items-center gap-4">
            <a
              href={`/menu/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 transition"
            >
              <ExternalLink size={18} />
              Ver menú público
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-600 transition"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ─── Categorías ─────────────── */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Categorías</h2>

          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nueva categoría..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
            <button
              type="submit"
              className="flex items-center gap-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm"
            >
              <Plus size={16} /> Agregar
            </button>
          </form>

          <div className="grid gap-2">
            {categories.length === 0 && (
              <p className="text-gray-400 text-sm">No hay categorías aún</p>
            )}

            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`bg-white rounded-lg border px-4 py-3 flex items-center justify-between transition cursor-pointer ${
                  selectedCat === cat.id
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleSelectCategory(cat.id)}
              >
                {editingCat === cat.id ? (
                  <div className="flex gap-2 flex-1 mr-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      value={editCatName}
                      onChange={(e) => setEditCatName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-orange-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateCategory(cat.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => setEditingCat(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium text-slate-700">{cat.nombre}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCat(cat.id);
                          setEditCatName(cat.nombre);
                        }}
                        className="text-gray-400 hover:text-orange-600 transition"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── Platillos ──────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Platillos
              {selectedCat && (
                <span className="text-base font-normal text-gray-500 ml-2">
                  — {categories.find((c) => c.id === selectedCat)?.nombre}
                </span>
              )}
            </h2>

            {selectedCat && !showProductForm && (
              <button
                onClick={() => {
                  setProdForm((f) => ({ ...f, categoria_id: selectedCat.toString() }));
                  setShowProductForm(true);
                }}
                className="flex items-center gap-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm"
              >
                <Plus size={16} /> Agregar platillo
              </button>
            )}
          </div>

          {!selectedCat && (
            <p className="text-gray-400 text-sm">Selecciona una categoría para ver sus platillos</p>
          )}

          {showProductForm && selectedCat && (
            <form onSubmit={handleSaveProduct} className="bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={prodForm.nombre}
                  onChange={(e) => setProdForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Nombre del platillo"
                  className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-500"
                  required
                />
                <input
                  value={prodForm.precio}
                  onChange={(e) => setProdForm((f) => ({ ...f, precio: e.target.value }))}
                  placeholder="Precio ($)"
                  type="number"
                  step="0.01"
                  className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-500"
                  required
                />
              </div>
              <textarea
                value={prodForm.descripcion}
                onChange={(e) => setProdForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descripción corta del platillo..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-500 h-20 resize-none"
              />

              {/* INPUT PARA CARGA DE IMAGEN (OBSERVACIÓN REVISOR) */}
              <div className="border border-dashed border-gray-300 rounded px-3 py-4 flex flex-col items-center justify-center bg-gray-50">
                {prodForm.imagen_url ? (
                  <div className="text-center">
                    <p className="text-xs text-green-600 font-medium mb-1">✓ Imagen lista</p>
                    <img src={prodForm.imagen_url} alt="Vista previa" className="h-16 w-16 object-cover rounded mx-auto border" />
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="mx-auto text-gray-400 mb-1" size={24} />
                    <span className="text-xs text-gray-500 block">Formatos permitidos: JPG, PNG</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="mt-2 text-xs text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 text-sm">
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="px-3 py-1.5 border rounded text-gray-500 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!precioValido || uploadingImage}
                  className="px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {editingProduct ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          )}

          {/* Listado de Platillos */}
          {selectedCat && products.length === 0 && (
            <p className="text-gray-400 text-sm">No hay platillos en esta categoría</p>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white border rounded-xl p-4 flex gap-4 shadow-sm relative items-start">
                {prod.imagen_url && (
                  <img src={prod.imagen_url} alt={prod.nombre} className="w-16 h-16 object-cover rounded-lg border flex-shrink-0" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">{prod.nombre}</h3>
                    <span className="font-bold text-orange-600">${parseFloat(prod.precio).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-2">{prod.descripcion || "Sin descripción"}</p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => startEditProduct(prod)}
                      className="text-xs flex items-center gap-1 text-gray-600 hover:text-orange-600"
                    >
                      <Edit3 size={12} /> Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="text-xs flex items-center gap-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={12} /> Eliminar
                    </button>
                    <button
                      onClick={() => handleToggleDisponible(prod)}
                      className={`text-xs ml-auto font-medium ${prod.disponible ? "text-green-600" : "text-gray-400"}`}
                    >
                      {prod.disponible ? "Disponible" : "Agotado"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
