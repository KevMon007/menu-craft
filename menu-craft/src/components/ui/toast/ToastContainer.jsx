import Toast from "./Toast";

function ToastContainer({ toasts }) {

    return (

        <div
            className="
                fixed
                top-6
                right-6
                z-50
                flex
                flex-col
                gap-3
            "
        >

            {toasts.map((toast) => (

                <Toast
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                />

            ))}

        </div>

    );

}

export default ToastContainer;