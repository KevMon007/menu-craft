import { X } from "lucide-react";

function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
}) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div
        className={`
          w-full
          ${sizes[size]}
          rounded-2xl
          bg-white
          shadow-2xl
          overflow-hidden
        `}
      >

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <h2 className="text-xl font-semibold">

            {title}

          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 transition"
          >

            <X size={18} />

          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          {children}

        </div>

        {/* Footer */}

        {footer && (

          <div className="border-t px-6 py-4 flex justify-end gap-3">

            {footer}

          </div>

        )}

      </div>

    </div>
  );
}

export default Modal;