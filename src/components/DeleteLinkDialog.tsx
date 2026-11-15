"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { LinkItem } from "../types/mylink";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface DeleteLinkDialogProps {
  isOpen: boolean;
  link: LinkItem | null;
  onClose: () => void;
  onConfirmDelete: (linkId: string) => Promise<void> | void;
}

export function DeleteLinkDialog({
  isOpen,
  link,
  onClose,
  onConfirmDelete,
}: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!link) return null;

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await onConfirmDelete(link.id);
      onClose();
    } catch (error) {
      console.error("링크 삭제 실패:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-[390px] p-6 text-center"
        onClose={handleClose}
      >
        <DialogHeader className="flex flex-col items-center text-center mb-2">
          {/* 빨간색 경고 아이콘 */}
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F2] flex items-center justify-center text-[#F04452] mb-3">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>

          {/* 요구사항 제목: "정말 삭제하시겠습니까?" */}
          <DialogTitle className="text-[20px] font-bold text-[#191F28] text-center">
            정말 삭제하시겠습니까?
          </DialogTitle>
        </DialogHeader>

        {/* 삭제 대상 링크 이름 표시 영역 */}
        <div className="mt-2 mb-4 p-3.5 bg-[#F9FAFB] border border-[#E5E8EB] rounded-2xl flex items-center gap-3 text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-2xs border border-[#E5E8EB]/60">
            <span>{link.icon || "🔗"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-[#191F28] truncate">
              {link.title}
            </p>
            <p className="text-[12px] text-[#8B95A1] truncate mt-0.5">
              {link.url}
            </p>
          </div>
        </div>

        {/* 요구사항 경고: "이 작업은 되돌릴 수 없습니다." (빨간색) */}
        <p className="text-[13px] font-semibold text-[#F04452] mb-5">
          이 작업은 되돌릴 수 없습니다.
        </p>

        {/* 요구사항 버튼: [취소] [삭제하기] */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 h-12 rounded-xl text-[14px] font-semibold"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 h-12 rounded-xl text-[14px] font-bold shadow-xs disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>삭제 중...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 stroke-[2.2]" />
                <span>삭제하기</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
