"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  QrCode,
  ShieldCheck,
  User,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useAuth, getGoogleAuthErrorMessage } from "../lib/authContext";
import { getUserProfilePath } from "../lib/urls";
import { Button } from "./ui/button";
import { GoogleIcon } from "./icons/GoogleIcon";
import { ProfileDropdown } from "./ProfileDropdown";

interface HeaderProps {
  onOpenQr: () => void;
  onShare: () => void;
  onShowToast: (msg: string) => void;
  linksCount?: number;
  totalClicks?: number;
}

export function Header({
  onOpenQr,
  onShare,
  onShowToast,
  linksCount = 0,
  totalClicks = 0,
}: HeaderProps) {
  const { user, userProfile, loading, signInWithGoogle, signOutUser } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const profile = await signInWithGoogle();
      if (profile) {
        onShowToast(`${profile.display_name} 님, 환영해요! 🎉`);
      }
    } catch (error) {
      onShowToast(getGoogleAuthErrorMessage(error));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOutUser();
      onShowToast("안전하게 로그아웃되었어요 👋");
    } catch {
      onShowToast("로그아웃 중 오류가 발생했어요 ⚠️");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const emailPrefix = (userProfile?.email || user?.email || "").split("@")[0];
  const currentHandle = userProfile?.handle || emailPrefix || "me";
  const personalPagePath = getUserProfilePath(user?.uid);

  return (
    <header className="sticky top-0 z-30 w-full max-w-[430px] bg-[#F9FAFB]/95 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-[#E5E8EB]/70">
      {/* 1. Left Brand Title → 루트 페이지(/)로 이동 */}
      <Link
        href="/"
        onClick={handleScrollToTop}
        className="flex items-center gap-1.5 text-left group cursor-pointer outline-hidden shrink-0"
        title="메인 페이지로 이동"
      >
        <span className="font-bold text-[16px] text-[#191F28] group-hover:text-[#3182F6] transition-colors max-w-[130px] truncate">
          {user ? `@${currentHandle}` : "@mylink"}
        </span>
        {user ? (
          <ShieldCheck className="w-4 h-4 text-[#3182F6] shrink-0" />
        ) : (
          <span className="text-[10px] font-semibold text-[#8B95A1] bg-[#F2F4F6] px-1.5 py-0.5 rounded-md">
            방문자
          </span>
        )}
      </Link>

      {/* 2. Right Action Controls */}
      <div className="flex items-center gap-1.5">
        {loading ? (
          <div className="flex items-center justify-center w-8 h-8">
            <Loader2 className="w-4 h-4 animate-spin text-[#8B95A1]" />
          </div>
        ) : user ? (
          <>
            {/* 개인별 페이지 바로가기 버튼 (Primary) */}
            <Link href={personalPagePath} title="내 개인별 페이지 보기">
              <Button
                variant="primary"
                size="sm"
                className="h-8 px-2.5 rounded-full text-[12px] font-bold gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden min-[370px]:inline">내 페이지</span>
              </Button>
            </Link>

            {/* 마이페이지 텍스트 버튼 */}
            <Link href="/edit" title="마이페이지 (프로필 & 링크 관리)">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 rounded-full text-[12px] font-semibold text-[#4E5968] hover:text-[#191F28] gap-1 shadow-2xs border-[#E5E8EB] bg-white cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#8B95A1]" />
                <span className="hidden min-[400px]:inline">관리</span>
              </Button>
            </Link>

            {/* QR Modal Trigger */}
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenQr}
              className="w-8 h-8 rounded-full shadow-2xs border-[#E5E8EB] bg-white cursor-pointer"
              title="QR 코드 보기"
              aria-label="QR 코드 보기"
            >
              <QrCode className="w-3.5 h-3.5 text-[#4E5968]" />
            </Button>

            {/* Share Trigger */}
            <Button
              variant="outline"
              size="icon"
              onClick={onShare}
              className="w-8 h-8 rounded-full shadow-2xs border-[#E5E8EB] bg-white cursor-pointer"
              title="프로필 링크 공유하기"
              aria-label="프로필 링크 공유하기"
            >
              <Share2 className="w-3.5 h-3.5 text-[#4E5968]" />
            </Button>

            {/* Enhanced Profile Dropdown Menu */}
            <div className="pl-1 border-l border-[#E5E8EB]">
              <ProfileDropdown
                user={user}
                userProfile={userProfile}
                linksCount={linksCount}
                totalClicks={totalClicks}
                onOpenQr={onOpenQr}
                onShare={onShare}
                onShowToast={onShowToast}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </div>
          </>
        ) : (
          <>
            {/* Google Social Login Button */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 rounded-full text-[12px] font-semibold text-[#333D4B] bg-white hover:bg-[#F2F4F6] border-[#D1D6DB] gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all"
              title="Google 계정으로 로그인"
            >
              {isLoggingIn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3182F6]" />
              ) : (
                <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>Google 로그인</span>
            </Button>

            {/* QR Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenQr}
              className="w-8 h-8 rounded-full shadow-2xs border-[#E5E8EB] bg-white cursor-pointer"
              title="QR 코드 보기"
              aria-label="QR 코드 보기"
            >
              <QrCode className="w-3.5 h-3.5 text-[#4E5968]" />
            </Button>

            {/* Share Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onShare}
              className="w-8 h-8 rounded-full shadow-2xs border-[#E5E8EB] bg-white cursor-pointer"
              title="프로필 공유하기"
              aria-label="프로필 공유하기"
            >
              <Share2 className="w-3.5 h-3.5 text-[#4E5968]" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
