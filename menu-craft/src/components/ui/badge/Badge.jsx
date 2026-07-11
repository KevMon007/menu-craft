const variants = {
  success: {
    bg: "bg-green-100",
    text: "text-green-700",
  },

  danger: {
    bg: "bg-red-100",
    text: "text-red-700",
  },

  warning: {
    bg: "bg-orange-100",
    text: "text-orange-700",
  },

  info: {
    bg: "bg-blue-100",
    text: "text-blue-700",
  },

  neutral: {
    bg: "bg-gray-100",
    text: "text-gray-700",
  },
};

function Badge({
  children,
  variant = "neutral",
  icon = null,
  className = "",
}) {

  const style = variants[variant] ?? variants.neutral;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${style.bg}
        ${style.text}
        ${className}
      `}
    >
      {icon && icon}

      {children}
    </span>
  );
}

export default Badge;