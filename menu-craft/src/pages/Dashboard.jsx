import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Trash2, Check, X, LogOut, ExternalLink } from "lucide-react";

function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_URL || "";
  return fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

function Dashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState(null);
  const [editCatName, setEditCatName] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
  });

  async function loadCategories() {
    try {
      const res = await api("/api/categories");
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadProducts(categoriaId) {
    try {
      const res = await api(`/api/products?categoria_id=${categoriaId}`);
      if (!res.ok) throw new Error("Error al cargar platillos");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
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
    try {
      const res = await api("/api/categories", {
        method: "POST",
        body: JSON.stringify({ nombre: newCatName.trim() }),
      });
      if (!res.ok) throw new Error("Error al crear categoría");
      await loadCategories();
      setNewCatName("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateCategory(id) {
    if (!editCatName.trim()) return;
    try {
      const res = await api(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nombre: editCatName.trim() }),
      });
      if (!res.ok) throw new Error("Error al actualizar categoría");
      await loadCategories();
      setEditingCat(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteCategory(id) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      const res = await api(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar categoría");
      if (selectedCat === id) handleSelectCategory(null);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    const body = {
      nombre: prodForm.nombre.trim(),
      descripcion: prodForm.descripcion.trim(),
      precio: parseFloat(prodForm.precio),
      categoria_id: parseInt(prodForm.categoria_id) || selectedCat,
    };

    try {
      if (editingProduct) {
        const res = await api(`/api/products/${editingProduct}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Error al actualizar platillo");
      } else {
        const res = await api("/api/products", {
          method: "POST",
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Error al crear platillo");
      }
      await loadProducts(selectedCat);
      resetProductForm();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleDisponible(product) {
    try {
      const res = await api(`/api/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify({ disponible: !product.disponible }),
      });
      if (!res.ok) throw new Error("Error al cambiar disponibilidad");
      await loadProducts(selectedCat);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm("¿Eliminar este platillo?")) return;
    try {
      const res = await api(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar platillo");
      await loadProducts(selectedCat);
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditProduct(product) {
    setEditingProduct(product.id);
    setProdForm({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: product.precio.toString(),
      categoria_id: product.categoria_id.toString(),
    });
    setShowProductForm(true);
  }

  function resetProductForm() {
    setShowProductForm(false);
    setEditingProduct(null);
    setProdForm({ nombre: "", descripcion: "", precio: "", categoria_id: "" });
  }

  const slug = localStorage.getItem("restaurantSlug");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  const precioValido = prodForm.precio && parseFloat(prodForm.precio) >= 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando...</p>
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X size={16} />
            </button>
          </div>
        )}

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
                  <div className="flex gap-2 flex-1 mr-2">
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
                  placeholder="Nombre del platillo *"
                  className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  required
                />
                <input
                  value={prodForm.precio}
                  onChange={(e) => setProdForm((f) => ({ ...f, precio: e.target.value }))}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Precio *"
                  className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  required
                />
                <div className="md:col-span-2">
                  <input
                    value={prodForm.descripcion}
                    onChange={(e) => setProdForm((f) => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Descripción (opcional)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition disabled:opacity-50"
                  disabled={!prodForm.nombre.trim() || !precioValido}
                >
                  {editingProduct ? "Guardar cambios" : "Agregar platillo"}
                </button>
              </div>
            </form>
          )}

          {selectedCat && products.length === 0 && !showProductForm && (
            <p className="text-gray-400 text-sm">No hay platillos en esta categoría</p>
          )}

          <div className="grid gap-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{prod.nombre}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        prod.disponible
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {prod.disponible ? "Disponible" : "Agotado"}
                    </span>
                  </div>

                  {prod.descripcion && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{prod.descripcion}</p>
                  )}

                  <p className="text-sm font-semibold text-orange-600 mt-0.5">
                    ${parseFloat(prod.precio).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleDisponible(prod)}
                    className={`text-sm px-3 py-1 rounded-lg border transition ${
                      prod.disponible
                        ? "border-red-300 text-red-600 hover:bg-red-50"
                        : "border-green-300 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {prod.disponible ? "Agotar" : "Disponible"}
                  </button>

                  <button
                    onClick={() => startEditProduct(prod)}
                    className="text-gray-400 hover:text-orange-600 transition"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
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
