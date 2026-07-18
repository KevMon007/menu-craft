const colorVariants = {
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  gray: {
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
};

function StatCard({
  title,
  value,
  icon,
  color = "orange",
}) {
  const selectedColor = colorVariants[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex items-center gap-4">

      <div
        className={`
          h-12
          w-12
          rounded-lg
          flex
          items-center
          justify-center
          ${selectedColor.bg}
          ${selectedColor.text}
        `}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800">
          {value}
        </h3>

        <p className="text-sm text-gray-500">
          {title}
        </p>
      </div>

    </div>
  );
}

export default StatCard;