import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Maximize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function StudentQrCode({ studentId }: { studentId: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(studentId, {
      width: 640,
      margin: 2,
      color: { dark: "#141b3d", light: "#ffffff" },
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => setDataUrl(null));
    return () => {
      active = false;
    };
  }, [studentId]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl border border-border bg-card p-3">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`QR code for student ${studentId}`}
            width={220}
            height={220}
            className="size-[220px]"
          />
        ) : (
          <div className="size-[220px] animate-pulse rounded-md bg-muted" />
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        This QR code contains your Student ID only. Show it at the door for physical
        class attendance.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <Maximize2 className="size-4" /> Enlarge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Attendance QR code</DialogTitle>
              <DialogDescription>{studentId}</DialogDescription>
            </DialogHeader>
            {dataUrl && (
              <img
                src={dataUrl}
                alt={`Enlarged QR code for student ${studentId}`}
                className="mx-auto w-full max-w-xs rounded-lg border border-border"
              />
            )}
          </DialogContent>
        </Dialog>
        {dataUrl && (
          <Button asChild size="sm">
            <a href={dataUrl} download={`${studentId}-qr.png`}>
              <Download className="size-4" /> Download
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
