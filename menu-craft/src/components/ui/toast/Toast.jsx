import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info
} from "lucide-react";

const variants = {

    success: {

        icon: CheckCircle2,

        bg: "bg-green-50",

        border: "border-green-200",

        text: "text-green-700",

        iconColor: "text-green-500",

    },

    error: {

        icon: XCircle,

        bg: "bg-red-50",

        border: "border-red-200",

        text: "text-red-700",

        iconColor: "text-red-500",

    },

    warning: {

        icon: AlertTriangle,

        bg: "bg-yellow-50",

        border: "border-yellow-200",

        text: "text-yellow-700",

        iconColor: "text-yellow-500",

    },

    info: {

        icon: Info,

        bg: "bg-blue-50",

        border: "border-blue-200",

        text: "text-blue-700",

        iconColor: "text-blue-500",

    }

};

function Toast({

    type = "success",

    message,

}) {

    const style = variants[type];

    const Icon = style.icon;

    return (

        <div
            className={`
                flex
                items-center
                gap-3
                rounded-xl
                border
                p-4
                shadow-lg
                ${style.bg}
                ${style.border}
            `}
        >

            <Icon
                className={style.iconColor}
                size={22}
            />

            <span
                className={`font-medium ${style.text}`}
            >
                {message}
            </span>

        </div>

    );

}

export default Toast;