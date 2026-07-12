function ProductCard({ product }) {

    return (

        <div
            className="
                bg-white
                rounded-lg
                border
                border-gray-200
                p-4
                flex
                justify-between
                gap-4
            "
        >

            <div className="flex-1 min-w-0">

                <h3 className="font-medium text-slate-800">

                    {product.nombre}

                </h3>

                {
                    product.descripcion && (

                        <p className="text-sm text-gray-500 mt-1">

                            {product.descripcion}

                        </p>

                    )
                }

            </div>

            <div className="shrink-0 text-right">

                <span className="font-semibold text-orange-600 text-lg">

                    ${parseFloat(product.precio).toFixed(2)}

                </span>

            </div>

        </div>

    );

}

export default ProductCard;