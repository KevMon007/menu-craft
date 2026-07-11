function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-sm
        transition-shadow
        duration-200
        hover:shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;