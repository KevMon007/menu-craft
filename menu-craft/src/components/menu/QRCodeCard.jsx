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

        <Card className="p-8">

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

                <div className="flex justify-center">

                    <Button
                        onClick={handleDownload}
                    >

                        Descargar QR

                    </Button>

                </div>

            </div>

        </Card>

    );

}

export default QRCodeCard;