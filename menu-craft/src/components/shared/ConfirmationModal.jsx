import { TriangleAlert } from "lucide-react";

import { Modal, Button } from "../ui";

function ConfirmationModal({
    open,
    title,
    message,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    onConfirm,
    onClose,
    loading = false,
}) {

    return (

        <Modal
            open={open}
            title={title}
            onClose={onClose}

            footer={
                <>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >

            <div className="flex gap-4">

                <div className="rounded-full bg-red-100 p-3">

                    <TriangleAlert
                        className="text-red-600"
                    />

                </div>

                <p className="text-gray-600">

                    {message}

                </p>

            </div>

        </Modal>

    );

}

export default ConfirmationModal;