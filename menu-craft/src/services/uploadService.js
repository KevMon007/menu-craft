const API_URL = import.meta.env.VITE_API_URL;

export const uploadProductImage = async (file) => {

    console.log(import.meta.env.VITE_API_URL);

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("imagen", file);

    const response = await fetch(
        `${API_URL}/api/uploads/platillo`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`,
            },

            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Error al subir la imagen"
        );
    }

    return data;

};