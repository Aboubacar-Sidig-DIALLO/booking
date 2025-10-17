"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseQRScannerOptions = {
  onResult: (text: string) => void;
};

export function useQRScanner({ onResult }: UseQRScannerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);

  const stop = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    if (!videoRef.current) return;
    videoRef.current.srcObject = media;
    await videoRef.current.play();
    setActive(true);
    // Placeholder: intégrer un décodeur (zxing/browser) ultérieurement
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { videoRef, start, stop, active };
}
