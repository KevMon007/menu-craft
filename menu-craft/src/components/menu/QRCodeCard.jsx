import { QrCode } from "lucide-react";
import { Card, Button } from "../ui";

function QRCodeCard() {

    return (

        <Card className="p-8">

            <div className="space-y-4">

                <div className="flex items-center gap-3">

                    <QrCode className="text-orange-500" />

                    <h2 className="text-xl font-semibold">

                        Código QR

                    </h2>

                </div>

                {/* Aquí irá el QR */}

                {/* Aquí irá el botón */}

            </div>

        </Card>

    );

}

export default QRCodeCard;