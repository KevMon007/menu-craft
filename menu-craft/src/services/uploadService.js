import { API_BASE_URL } from "./api";

export const uploadProductImage = async (file) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("imagen", file);

    const response = await fetch(`${API_BASE_URL}/api/uploads/platillo`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("restaurantSlug");
        window.dispatchEvent(new Event("auth:logout"));
        throw new Error("Sesión expirada. Inicia sesión nuevamente.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al subir la imagen");
    }

    return data;
};
