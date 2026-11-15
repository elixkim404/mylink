"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Copy, Loader2, QrCode as QrIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { getBaseAppUrl } from "../lib/urls";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  handle: string;
  url?: string;
  onCopySuccess: () => void;
}

export function QRCodeModal({
  isOpen,
  onClose,
  displayName,
  handle,
  url,
  onCopySuccess,
}: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 스마트폰으로 스캔 시 접속할 실제 퍼블릭 URL (더 이상 localhost가 아닌 실제 서비스 도메인)
  const profileUrl = url || getBaseAppUrl();

  // 모달이 열리거나 URL이 변경될 때 실제 스캔 가능한 QR 코드 생성
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    queueMicrotask(() => {
      setIsGenerating(true);
    });

    QRCode.toDataURL(profileUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: "#191F28",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error("QR 코드 생성 오류:", err);
        if (isMounted) {
          setIsGenerating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, profileUrl]);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(profileUrl);
        onCopySuccess();
      }
    } catch (err) {
      console.warn("URL 복사 실패:", err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;

    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = qrDataUrl;
      downloadLink.download = `mylink-${handle || "profile"}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (e) {
      console.error("QR 이미지 다운로드 오류:", e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="text-center p-6 sm:p-7">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-[#E8F3FF] text-[#3182F6] flex items-center justify-center mx-auto mb-2">
            <QrIcon className="w-5 h-5" />
          </div>
          <DialogTitle>{displayName} 님의 실제 프로필 QR</DialogTitle>
          <DialogDescription>
            스마트폰 카메라로 비추면 내 프로필 링크로 바로 연결돼요!
          </DialogDescription>
        </DialogHeader>

        {/* Real Scannable QR Code Frame (TDS Card) */}
        <div className="my-5 flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E8EB] shadow-xs relative flex items-center justify-center min-w-[200px] min-h-[200px]">
            {isGenerating || !qrDataUrl ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-[#8B95A1]">
                <Loader2 className="w-6 h-6 animate-spin text-[#3182F6]" />
                <span className="text-[12px] font-medium">QR 코드 생성 중...</span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`${displayName} 님의 마이링크 QR 코드`}
                className="w-48 h-48 rounded-xl object-contain"
              />
            )}
          </div>

          {/* Profile URL Preview Card */}
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F4F6] text-[#333D4B] text-[12px] font-medium max-w-[280px]">
            <span className="text-[#3182F6] font-bold shrink-0">URL</span>
            <span className="truncate">{profileUrl}</span>
          </div>
        </div>

        {/* Action Buttons (TDS Style) */}
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={handleDownloadQR}
            disabled={!qrDataUrl || isGenerating}
            variant="default"
            size="lg"
            className="w-full h-11.5 rounded-xl text-[14px] font-bold cursor-pointer gap-2"
          >
            <Download className="w-4 h-4" />
            <span>QR 이미지 저장 (PNG)</span>
          </Button>

          <Button
            onClick={handleCopy}
            variant="secondary"
            size="lg"
            className="w-full h-11.5 rounded-xl text-[14px] font-semibold cursor-pointer gap-2 text-[#333D4B]"
          >
            <Copy className="w-4 h-4 text-[#6B7684]" />
            <span>프로필 주소 복사하기</span>
          </Button>

          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-9 rounded-xl text-[#8B95A1] hover:text-[#191F28] text-[13px] font-medium cursor-pointer"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
