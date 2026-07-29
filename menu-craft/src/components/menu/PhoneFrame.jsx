function PhoneFrame({ children }) {

    return (

        <div
            className="
                relative
                mx-auto
                w-full
                max-w-[330px]
                rounded-[34px]
                border-[8px]
                border-slate-900
                bg-slate-900
                shadow-2xl
                md:max-w-[390px]
                md:rounded-[42px]
                md:border-[10px]
            "
        >

            {/* Dynamic Island */}

            <div
                className="
                    absolute
                    left-1/2
                    top-4
                    z-20
                    h-6
                    w-24
                    -translate-x-1/2
                    rounded-full
                    bg-black
                    shadow-md
                    md:top-5
                    md:h-7
                    md:w-32
                "
            />

            {/* Pantalla */}

            <div
                className="
                    hide-scrollbar
                    h-[620px]
                    overflow-y-auto
                    rounded-[24px]
                    bg-white
                    md:h-[780px]
                    md:rounded-[30px]
                "
            >

                {children}

            </div>

        </div>

    );

}

export default PhoneFrame;
