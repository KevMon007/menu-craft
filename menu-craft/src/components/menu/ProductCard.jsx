function ProductCard({ product, preview=false }) {

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
                            className={`
                                        w-full
                                        rounded-xl
                                        object-cover
                                        ${
                                            preview
                                                ? "h-44"
                                                : "h-40"
                                        }
                                    `}
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

                        <p className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-gray-500
                                        line-clamp-2
                                    ">

                            {product.descripcion}

                        </p>

                    )
                }

                <div className="mt-auto pt-5 text-right">

                <span className="text-xl font-bold text-[#fc4b08]">

                    ${parseFloat(product.precio).toFixed(2)}

                </span>

                </div>

                </div>

            </div>

        </div>

    );

}

export default ProductCard;