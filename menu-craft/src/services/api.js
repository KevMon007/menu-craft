export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function apiFetch(endpoint, options = {}) {

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("restaurantSlug");
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Sesión expirada. Inicia sesión nuevamente.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error en la petición");
  }

  return data;
}
