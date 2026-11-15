"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Copy,
  LogOut,
  QrCode,
  Share2,
  ChevronDown,
  MousePointerClick,
  Layers,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import type { User as FirebaseUser } from "firebase/auth";
import type { UserProfileDoc } from "../types/mylink";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { getUserProfileFullUrl, getUserProfilePath } from "../lib/urls";

interface ProfileDropdownProps {
  user: FirebaseUser;
  userProfile: UserProfileDoc | null;
  linksCount: number;
  totalClicks: number;
  onOpenQr: () => void;
  onShare: () => void;
  onShowToast: (msg: string) => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export function ProfileDropdown({
  user,
  userProfile,
  linksCount,
  totalClicks,
  onOpenQr,
  onShare,
  onShowToast,
  onLogout,
  isLoggingOut,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 이메일 앞부분 기반 display name
  const emailPrefix = (userProfile?.email || user.email || "").split("@")[0];
  const displayName = userProfile?.display_name || emailPrefix || "마이링크 회원";
  const handle = userProfile?.handle || emailPrefix || "me";
  const avatarUrl = userProfile?.avatar_url || user.photoURL || "/images/avatar.svg";

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.email && typeof window !== "undefined") {
      await navigator.clipboard.writeText(user.email);
      onShowToast("이메일 주소가 복사되었어요 📋");
    }
  };

  const handleCopyProfileUrl = async () => {
    if (typeof window !== "undefined") {
      const url = getUserProfileFullUrl(user.uid);
      await navigator.clipboard.writeText(url);
      onShowToast("내 프로필 링크가 복사되었어요 🔗");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button: User Avatar + Arrow Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#E5E8EB]/50 transition-colors cursor-pointer group outline-hidden border border-[#E5E8EB] bg-white shadow-2xs"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="내 프로필 메뉴 열기"
      >
        <Avatar className="w-7 h-7 border border-[#E5E8EB] group-hover:scale-105 transition-transform">
          <AvatarImage src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          <AvatarFallback className="text-[10px] font-bold bg-[#E8F3FF] text-[#3182F6]">
            {displayName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8B95A1] group-hover:text-[#191F28] transition-transform duration-200 mr-1 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-[#E5E8EB] z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
          {/* 1. Header Profile Summary */}
          <div className="flex items-start gap-3 pb-3 border-b border-[#F2F4F6]">
            <Avatar className="w-11 h-11 border border-[#E5E8EB] shadow-2xs shrink-0">
              <AvatarImage src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              <AvatarFallback className="text-[12px] font-bold bg-[#E8F3FF] text-[#3182F6]">
                {displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[15px] text-[#191F28] truncate max-w-[130px]">
                  {displayName}
                </span>
                <Badge variant="brand" className="text-[10px] px-1.5 py-0 h-4.5 font-semibold">
                  Google 연동
                </Badge>
              </div>

              <span className="text-[12px] text-[#3182F6] font-medium truncate">
                @{handle}
              </span>

              {/* Email with copy icon */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 text-[11px] text-[#8B95A1] hover:text-[#4E5968] transition-colors mt-0.5 truncate group cursor-pointer outline-hidden"
                title="이메일 복사"
              >
                <span className="truncate max-w-[150px]">{user.email}</span>
                <Copy className="w-2.5 h-2.5 group-hover:scale-110 transition-transform shrink-0" />
              </button>
            </div>
          </div>

          {/* 2. Mini Stats Snapshot */}
          <div className="my-3 grid grid-cols-2 gap-2 bg-[#F9FAFB] p-2.5 rounded-xl border border-[#E5E8EB]/70">
            <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-2xs text-center">
              <div className="flex items-center gap-1 text-[#8B95A1] text-[11px] font-medium mb-0.5">
                <Layers className="w-3 h-3 text-[#3182F6]" />
                <span>등록 링크</span>
              </div>
              <span className="text-[15px] font-bold text-[#191F28] tabular-nums">
                {linksCount}개
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-2xs text-center">
              <div className="flex items-center gap-1 text-[#8B95A1] text-[11px] font-medium mb-0.5">
                <MousePointerClick className="w-3 h-3 text-[#2B9D5B]" />
                <span>누적 클릭</span>
              </div>
              <span className="text-[15px] font-bold text-[#191F28] tabular-nums">
                {totalClicks}회
              </span>
            </div>
          </div>

          {/* Firestore Path Hint */}
          <div className="px-1 mb-2.5 flex items-center justify-between text-[10px] text-[#8B95A1]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#3182F6]" />
              개인화 경로:
            </span>
            <code className="bg-[#F2F4F6] px-1.5 py-0.5 rounded font-mono text-[#4E5968] truncate max-w-[150px]">
              users/{user.uid.slice(0, 8)}...
            </code>
          </div>

          {/* 3. Action Menu Items */}
          <div className="flex flex-col gap-1 border-t border-[#F2F4F6] pt-2">
            {/* 내 개인 페이지 바로가기 (userId 기반) */}
            <Link
              href={getUserProfilePath(user.uid)}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-semibold text-[#191F28] hover:bg-[#E8F3FF] hover:text-[#3182F6] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#3182F6] group-hover:scale-105 transition-transform" />
                <span>내 개인 페이지</span>
              </div>
              <span className="text-[11px] text-[#3182F6] font-medium group-hover:underline max-w-[120px] truncate font-mono">
                /{user.uid.slice(0, 10)}... &gt;
              </span>
            </Link>

            {/* 마이페이지 바로가기 */}
            <Link
              href="/edit"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-semibold text-[#333D4B] hover:bg-[#F2F4F6] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#3182F6] group-hover:scale-105 transition-transform" />
                <span>마이페이지</span>
              </div>
              <span className="text-[11px] text-[#8B95A1] font-normal group-hover:text-[#4E5968]">
                프로필 & 링크 관리 &gt;
              </span>
            </Link>

            {/* 내 링크 복사 */}
            <button
              type="button"
              onClick={handleCopyProfileUrl}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#333D4B] hover:bg-[#F2F4F6] transition-colors group cursor-pointer text-left w-full outline-hidden"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-[#4E5968] group-hover:text-[#3182F6] transition-colors" />
                <span>내 프로필 링크 복사</span>
              </div>
              <span className="text-[10px] text-[#8B95A1]">URL</span>
            </button>

            {/* 프로필 공유하기 */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onShare();
              }}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#333D4B] hover:bg-[#F2F4F6] transition-colors group cursor-pointer text-left w-full outline-hidden"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#4E5968] group-hover:text-[#3182F6] transition-colors" />
                <span>프로필 공유하기</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#B0B8C1]" />
            </button>

            {/* QR 코드 보기 */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenQr();
              }}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#333D4B] hover:bg-[#F2F4F6] transition-colors group cursor-pointer text-left w-full outline-hidden"
            >
              <QrCode className="w-4 h-4 text-[#4E5968] group-hover:text-[#3182F6] transition-colors" />
              <span>QR 코드 공유</span>
            </button>
          </div>

          {/* 4. Logout Section */}
          <div className="border-t border-[#F2F4F6] pt-1.5 mt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#F04452] hover:bg-[#FFF0F2] transition-colors cursor-pointer w-full text-left outline-hidden"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
