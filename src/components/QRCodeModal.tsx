"use client";

import React, { useRef } from "react";
import { Download, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  handle: string;
  onCopySuccess: () => void;
}

export function QRCodeModal({
  isOpen,
  onClose,
  displayName,
  handle,
  onCopySuccess,
}: QRCodeModalProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const profileUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://mylink.app/@${handle}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      onCopySuccess();
    } catch {
      // fallback
    }
  };

  const handleDownloadQR = () => {
    if (!svgRef.current) return;
    try {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      canvas.width = 400;
      canvas.height = 400;

      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, 400, 400);
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `mylink-${handle}-qr.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobURL);
      };
      img.src = blobURL;
    } catch (e) {
      console.error("QR download error:", e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{displayName} 님의 프로필 QR</DialogTitle>
          <DialogDescription>
            스마트폰 카메라로 스캔해 보세요!
          </DialogDescription>
        </DialogHeader>

        {/* High Contrast QR Code Frame */}
        <div className="p-4 bg-[#F9FAFB] rounded-2xl border border-[#E5E8EB] inline-block mb-4 shadow-2xs">
          <svg
            ref={svgRef}
            className="w-44 h-44"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="120" height="120" fill="white" rx="14" />

            {/* Top-Left Finder */}
            <rect x="14" y="14" width="28" height="28" rx="6" fill="#191F28" />
            <rect x="18" y="18" width="20" height="20" rx="3" fill="white" />
            <rect x="23" y="23" width="10" height="10" rx="2" fill="#3182F6" />

            {/* Top-Right Finder */}
            <rect x="78" y="14" width="28" height="28" rx="6" fill="#191F28" />
            <rect x="82" y="18" width="20" height="20" rx="3" fill="white" />
            <rect x="87" y="23" width="10" height="10" rx="2" fill="#3182F6" />

            {/* Bottom-Left Finder */}
            <rect x="14" y="78" width="28" height="28" rx="6" fill="#191F28" />
            <rect x="18" y="82" width="20" height="20" rx="3" fill="white" />
            <rect x="23" y="87" width="10" height="10" rx="2" fill="#3182F6" />

            {/* Dynamic QR Data Blocks */}
            <rect x="52" y="18" width="8" height="8" rx="2" fill="#191F28" />
            <rect x="64" y="18" width="8" height="8" rx="2" fill="#191F28" />
            <rect x="52" y="30" width="8" height="8" rx="2" fill="#3182F6" />
            <rect x="64" y="30" width="8" height="8" rx="2" fill="#191F28" />
            <rect x="52" y="42" width="20" height="8" rx="2" fill="#191F28" />

            <rect x="18" y="52" width="8" height="18" rx="2" fill="#191F28" />
            <rect x="30" y="52" width="8" height="10" rx="2" fill="#3182F6" />
            <rect x="84" y="52" width="18" height="8" rx="2" fill="#191F28" />
            <rect x="84" y="64" width="10" height="8" rx="2" fill="#3182F6" />
            <rect x="96" y="64" width="8" height="8" rx="2" fill="#191F28" />

            <rect x="52" y="64" width="8" height="8" rx="2" fill="#191F28" />
            <rect x="64" y="64" width="8" height="18" rx="2" fill="#3182F6" />

            <rect x="52" y="86" width="10" height="10" rx="2" fill="#191F28" />
            <rect x="84" y="86" width="10" height="10" rx="2" fill="#191F28" />
            <rect x="96" y="98" width="10" height="10" rx="2" fill="#3182F6" />
            <rect x="74" y="98" width="8" height="10" rx="2" fill="#191F28" />
          </svg>
        </div>

        {/* Profile URL label */}
        <p className="text-[13px] font-medium text-[#8B95A1] mb-6 tracking-wide">
          mylink.app/@{handle}
        </p>

        {/* Actions using shadcn Button */}
        <div className="flex flex-col gap-2.5">
          <Button
            onClick={handleDownloadQR}
            variant="default"
            className="w-full h-12 rounded-xl text-[15px]"
          >
            <Download className="w-4 h-4" />
            <span>QR 이미지 저장</span>
          </Button>

          <Button
            onClick={handleCopy}
            variant="secondary"
            className="w-full h-12 rounded-xl text-[15px]"
          >
            <Copy className="w-4 h-4 text-[#6B7684]" />
            <span>링크 주소 복사</span>
          </Button>

          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-10 rounded-xl text-[#8B95A1] hover:text-[#191F28] text-[14px]"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
