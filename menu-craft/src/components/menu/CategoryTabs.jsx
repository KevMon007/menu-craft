function CategoryTabs({
    categories,
    selectedCategory,
    onSelectCategory,
    preview = false
}) {

    return (

        <div
            className={`
                hide-scrollbar
                flex
                gap-3
                overflow-x-auto
                pb-3
                ${
                    preview
                        ? "px-1 pt-4"
                        : "pt-5"
                }
            `}
        >

            {/* Botón Todas */}

            <button
                onClick={() => onSelectCategory("all")}
                className={`
                    rounded-full
                    px-3
                    py-2
                    text-sm
                    font-medium
                    whitespace-nowrap
                    transition

                    ${
                        selectedCategory === "all"
                            ? "bg-[#fc4b08] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                `}
            >
                Todas
            </button>

            {/* Categorías */}

            {categories.map((category) => (

                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={`
                        rounded-full
                        px-3
                        py-2
                        text-sm
                        font-medium
                        whitespace-nowrap
                        transition

                        ${
                            selectedCategory === category.id
                                ? "bg-[#fc4b08] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                    `}
                >
                    {category.nombre}
                </button>

            ))}

        </div>

    );

}

export default CategoryTabs;