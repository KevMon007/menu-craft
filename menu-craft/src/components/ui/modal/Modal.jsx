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
    <div className="
          fixed
          inset-0
          z-50
          bg-black/40
          p-4
          overflow-y-auto
          flex
          items-center
          justify-center
        ">

      <div
        className={`
          w-full
          ${sizes[size]}
          max-h-[90vh]
          rounded-2xl
          bg-white
          shadow-2xl
          overflow-hidden
          flex
          flex-col
        `}
      >

        {/* Header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">

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

        <div className="
                flex-1
                overflow-y-auto
                p-6
              ">

          {children}

        </div>

        {/* Footer */}

        {footer && (

          <div className="sticky bottom-0 z-10 flex justify-end gap-3 border-t bg-white px-6 py-4">

            {footer}

          </div>

        )}

      </div>

    </div>
  );
}

export default Modal;