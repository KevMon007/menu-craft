import { useState } from "react";

export function useToast() {

    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {

        const id = Date.now();

        setToasts((prev) => [

            ...prev,

            {
                id,
                type,
                message,
            },

        ]);

        setTimeout(() => {

            setToasts((prev) =>

                prev.filter((toast) => toast.id !== id)

            );

        }, 3000);

    };

    return {

        toasts,

        success: (message) => addToast("success", message),

        error: (message) => addToast("error", message),

        warning: (message) => addToast("warning", message),

        info: (message) => addToast("info", message),

    };

}