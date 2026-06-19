function AuthHero({
  title,
  highlight,
  description,
  benefits,
}) {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950">
      <div className="p-10 w-full">
        <h1 className="text-white text-2xl font-bold">
          MenuCraft
        </h1>

        <div className="mt-32">
          <h2 className="text-5xl font-bold text-white leading-tight">
            {title}
            <br />
            <span className="text-orange-500">
              {highlight}
            </span>
          </h2>

          <p className="text-gray-400 mt-6 text-lg">
            {description}
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full border border-orange-500"></div>

              <span className="text-gray-300">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthHero;