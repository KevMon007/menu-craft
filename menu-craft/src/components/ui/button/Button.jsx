const variants = {
  primary:
    "bg-orange-500 hover:bg-orange-600 text-white",

  secondary:
    "bg-gray-100 hover:bg-gray-200 text-gray-700",

  danger:
    "bg-red-500 hover:bg-red-600 text-white",

  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-600",
};

function Button({
  children,
  variant = "primary",
  type = "button",
  form,
  onClick,
  className = "",
  disabled = false,
  icon,
}) {
  return (
    <button
      form={form}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-medium
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {icon && icon}

      {children}
    </button>
  );
}

export default Button;