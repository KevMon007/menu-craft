import ProductCard from "./ProductCard";

function ProductGrid({ categories,
                    selectedCategory,
                    preview = false, }) {

    const visibleCategories =
    selectedCategory === "all"
        ? categories
        : categories.filter(
            (category) => category.id === selectedCategory
        );


    return (

        <div className="space-y-8">

            {visibleCategories.map((category) => (

                <section key={category.id}>

                    <h2
                        className="
                            mb-4
                            border-b-2
                            border-orange-500
                            pb-2
                            text-xl
                            font-semibold
                            text-slate-800
                        "
                    >
                        {category.nombre}
                    </h2>

                    {
                        category.platillos.length === 0 && (

                            <p className="text-sm text-gray-400">

                                Sin platillos disponibles

                            </p>

                        )
                    }

                    <div
                        className={
                            preview
                                ? "grid grid-cols-1 gap-5"
                                : "grid grid-cols-1 gap-5 sm:grid-cols-2"
                        }
                    >

                        {category.platillos.map((product) => (

                            <ProductCard
                                key={product.id}
                                product={product}
                                preview={preview}
                            />

                        ))}

                    </div>

                </section>

            ))}

        </div>

    );

}

export default ProductGrid;