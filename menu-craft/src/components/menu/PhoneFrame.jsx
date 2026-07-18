function PhoneFrame({ children }) {

    return (

        <div
            className="
                relative
                mx-auto
                w-[390px]
                rounded-[42px]
                border-[10px]
                border-slate-900
                bg-slate-900
                shadow-2xl
            "
        >

            {/* Dynamic Island */}

            <div
                className="
                    absolute
                    left-1/2
                    top-5
                    z-20
                    h-7
                    w-32
                    -translate-x-1/2
                    rounded-full
                    bg-black
                    shadow-md
                "
            />

            {/* Pantalla */}

            <div
                className="
                    hide-scrollbar
                    h-[780px]
                    overflow-y-auto
                    rounded-[30px]
                    bg-white
                "
            >

                {children}

            </div>

        </div>

    );

}

export default PhoneFrame;