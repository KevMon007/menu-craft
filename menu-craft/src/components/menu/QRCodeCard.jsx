import { QrCode } from "lucide-react";
import { Card, Button } from "../ui";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

function QRCodeCard({menuUrl}) {

    const qrRef = useRef(null);

    const handleDownload = () => {

        const canvas = qrRef.current;

        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");

        link.href = pngUrl;

        link.download = `${menuUrl.split("/").pop()}-qr.png`;

        link.click();

    };

    return (

        <Card className="p-5 md:p-8">

            <div className="space-y-4">

                <div className="flex items-center gap-3">

                    <QrCode className="text-orange-500" />

                    <h2 className="text-xl font-semibold">

                        Código QR

                    </h2>

                </div>

                <div className="flex justify-center">
                    <QRCodeCanvas
                        ref={qrRef}
                        value={menuUrl}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        includeMargin
                    />
                </div>

                <p className="text-center text-sm text-gray-500">
                    Descarga este código para colocarlo en mesas, flyers o redes sociales.
                </p>

                <div className="flex justify-center">

                    <Button
                        onClick={handleDownload}
                        className="w-full md:w-auto"
                    >

                        Descargar QR

                    </Button>

                </div>

            </div>

        </Card>

    );

}

export default QRCodeCard;
