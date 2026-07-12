function ProductCard({ product }) {

    return (

        <div
            className="
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-sm
                transition
                hover:-translate-y-1
                hover:shadow-lg
            "
        >

            <div className="flex-1 min-w-0">

                {
                    product.url_foto && (

                        <img
                            src={product.url_foto}
                            alt={product.nombre}
                            className="
                                h-40
                                w-full
                                rounded-xl
                                object-cover
                            "
                        />

                    )
                }

                <div className="flex
                                flex-1
                                flex-col
                                p-5">

                <h3 className="text-lg
        font-semibold
        text-slate-900">

                                    {product.nombre}

                </h3>

                {
                    product.descripcion && (

                        <p className="text-sm text-gray-500 mt-1">

                            {product.descripcion}

                        </p>

                    )
                }

                <div className="mt-auto pt-5 text-right">

                <span className="text-xl font-bold text-orange-500">

                    ${parseFloat(product.precio).toFixed(2)}

                </span>

                </div>

                </div>

            </div>

        </div>

    );

}

export default ProductCard;