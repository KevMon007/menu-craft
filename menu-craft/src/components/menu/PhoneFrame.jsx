function PhoneFrame({ children }) {

    return (

        <div
            className="
                mx-auto
                w-[360px]
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
                    mx-auto
                    mt-3
                    h-7
                    w-32
                    rounded-full
                    bg-black
                "
            />

            {/* Pantalla */}

            <div
                className="
                    mt-3
                    h-[700px]
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