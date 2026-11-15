"use client";

import React, { useState } from "react";
import { Lock, Sparkles, FolderLock, UserCheck, BarChart3, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../lib/authContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { GoogleIcon } from "./icons/GoogleIcon";

interface LoginNoticeCardProps {
  onShowToast: (msg: string) => void;
}

export function LoginNoticeCard({ onShowToast }: LoginNoticeCardProps) {
  const { signInWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const profile = await signInWithGoogle();
      if (profile) {
        onShowToast(`${profile.display_name} 님 환영해요! 나만의 마이페이지가 준비되었어요 🎉`);
      }
    } catch {
      onShowToast("Google 로그인 중 문제가 발생했어요. 다시 시도해주세요 ⚠️");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Card className="p-5.5 text-left bg-linear-to-b from-white to-[#F9FAFB] border border-[#E5E8EB] shadow-sm relative overflow-hidden">
      {/* Top Badge */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="brand" className="text-[11px] px-2.5 py-0.5 gap-1 font-semibold">
          <Lock className="w-3 h-3 stroke-[2.5]" />
          <span>로그인 안내</span>
        </Badge>
        <span className="text-[11px] text-[#8B95A1] font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#3182F6]" />
          Google 소셜 로그인 지원
        </span>
      </div>

      {/* Main Headline */}
      <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight mb-2 leading-snug">
        로그인하고 나만의 마이링크를 시작해보세요
      </h2>

      {/* Description text */}
      <p className="text-[13px] text-[#4E5968] leading-relaxed mb-4">
        로그인하시면 나만의 <strong className="text-[#3182F6] font-semibold">마이페이지</strong>에서
        원하는 링크를 자유롭게 추가·편집하고, 언제 어디서나 퍼블릭 프로필을 공유할 수 있어요.
        지금은 샘플 둘러보기 화면이며, 로그인 이후 모든 기능을 온전히 사용할 수 있습니다.
      </p>

      {/* Feature bullet list */}
      <div className="bg-[#F2F4F6]/70 rounded-xl p-3 flex flex-col gap-2 mb-4 border border-[#E5E8EB]/50">
        <div className="flex items-start gap-2 text-[12px] text-[#333D4B]">
          <FolderLock className="w-4 h-4 text-[#3182F6] shrink-0 mt-0.5" />
          <span>
            <strong className="font-semibold text-[#191F28]">개인화 클라우드 저장</strong>:{" "}
            Firestore <code className="text-[11px] bg-white px-1.5 py-0.5 rounded text-[#3182F6] font-mono">users/(user.uid)/links</code>에 안전하게 보관돼요
          </span>
        </div>
        <div className="flex items-start gap-2 text-[12px] text-[#333D4B]">
          <UserCheck className="w-4 h-4 text-[#2B9D5B] shrink-0 mt-0.5" />
          <span>
            <strong className="font-semibold text-[#191F28]">마이페이지 프로필 관리</strong>:{" "}
            닉네임, 한 줄 소개, 프로필 사진 및 소셜 채널 맞춤 설정
          </span>
        </div>
        <div className="flex items-start gap-2 text-[12px] text-[#333D4B]">
          <BarChart3 className="w-4 h-4 text-[#FA622F] shrink-0 mt-0.5" />
          <span>
            <strong className="font-semibold text-[#191F28]">실시간 클릭 수 카운트</strong>:{" "}
            방문자들이 누른 링크 클릭 통계를 실시간으로 집계
          </span>
        </div>
      </div>

      {/* Google Login CTA Button */}
      <Button
        onClick={handleLogin}
        disabled={isLoggingIn}
        variant="default"
        size="lg"
        className="w-full bg-[#191F28] hover:bg-[#333D4B] text-white rounded-xl font-bold text-[14px] h-11 gap-2 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Google 로그인 진행 중...</span>
          </>
        ) : (
          <>
            <GoogleIcon className="w-4 h-4" />
            <span>Google 계정으로 3초 만에 시작하기</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70" />
          </>
        )}
      </Button>
    </Card>
  );
}
