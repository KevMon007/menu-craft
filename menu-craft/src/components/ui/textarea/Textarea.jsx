function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
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

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
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
          resize-none
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

export default Textarea;