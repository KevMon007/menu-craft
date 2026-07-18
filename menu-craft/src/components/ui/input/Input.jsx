function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  disabled = false,
  icon = null,
  error,
}) {
  return (
    <div className="relative">

      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      {label && (
          <label
              htmlFor={name}
              className="mb-2 block text-sm font-medium text-gray-700"
          >
              {label}
          </label>
      )}

      <input
        name={name}
        id={name}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e)}
        className={`
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          py-3
          ${icon ? "pl-10" : "px-4"}
          pr-4
          text-sm
          outline-none
          transition-all
          duration-200
          focus:border-orange-500
          focus:ring-2
          focus:ring-orange-200
          disabled:bg-gray-100
          disabled:cursor-not-allowed
          ${className}
        `}
      />

    </div>
  );
}

export default Input;