import { QrCode } from "lucide-react";
import { Card, Button } from "../ui";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

function QRCodeCard({ menuUrl }) {
    const qrRef = useRef(null);

    // RN-01 & RN-04: Prioriza la prop, luego la variable de entorno y finalmente un fallback local seguro
    const finalUrl = menuUrl || import.meta.env.VITE_PUBLIC_MENU_URL || "http://localhost:5173/menu";

    const handleDownload = () => {
        const canvas = qrRef.current;
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;

        // Evita el crash si finalUrl es extraño o no tiene barras diagonales
        const filename = finalUrl.includes("/") ? finalUrl.split("/").pop() : "menu";
        link.download = `${filename || "codigo"}-qr.png`;

        link.click();
    };

    return (
        <Card className="p-8">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <QrCode className="text-orange-500" />
                    <h2 className="text-xl font-semibold">
                        Código QR Dinámico
                    </h2>
                </div>

                <div className="flex justify-center">
                    <QRCodeCanvas
                        ref={qrRef}
                        value={finalUrl}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        includeMargin
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Button onClick={handleDownload}>
                        Descargar QR
                    </Button>
                    <span className="text-xs text-gray-400 break-all text-center max-w-[200px]">
                        Destino: {finalUrl}
                    </span>
                </div>
            </div>
        </Card>
    );
}

export default QRCodeCard;
