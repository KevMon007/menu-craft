function Select({
  value,
  onChange,
  options = [],
  placeholder = "Selecciona una opción",
  className = "",
  disabled = false,
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        px-4
        py-3
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
    >
      <option value="">
        {placeholder}
      </option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;