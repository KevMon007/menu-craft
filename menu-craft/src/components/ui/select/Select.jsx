function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  valueKey = "value",
  labelKey = "label",
  placeholder = "Selecciona una opción",
  className = "",
  disabled = false,
}) {
  return (
    <div>

      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
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
            key={option[valueKey]}
            value={option[valueKey]}
          >
            {option[labelKey]}
          </option>
        ))}
      </select>

    </div>
  );
}

export default Select;