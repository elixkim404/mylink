"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserX, Home, Sparkles, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { UserProfileView } from "../components/UserProfileView";

export default function NotFound() {
  const [dynamicUserId, setDynamicUserId] = useState<string | null>(null);
  const [checkedPath, setCheckedPath] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cleaned = window.location.pathname
        .replace(/^\/mylink(\/|$)/, "/")
        .replace(/^\/+|\/+$/g, "");

      // 단일 세그먼트(/mylink/{userId} 또는 /{userId})인 경우 동적 유저 프로필 페이지로 연결
      if (
        cleaned &&
        !cleaned.includes("/") &&
        cleaned !== "edit" &&
        cleaned !== "_not-found" &&
        cleaned !== "404"
      ) {
        queueMicrotask(() => {
          setDynamicUserId(decodeURIComponent(cleaned));
          setCheckedPath(true);
        });
        return;
      }
    }
    queueMicrotask(() => {
      setCheckedPath(true);
    });
  }, []);

  if (!checkedPath) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-5">
        <Loader2 className="w-8 h-8 animate-spin text-[#3182F6]" />
      </div>
    );
  }

  if (dynamicUserId) {
    return <UserProfileView userId={dynamicUserId} />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center justify-center px-5 py-12 selection:bg-[#3182F6] selection:text-white">
      <main className="w-full max-w-[430px] flex flex-col items-center text-center">
        {/* 404 Card */}
        <Card className="w-full p-8 flex flex-col items-center shadow-sm">
          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0F2] flex items-center justify-center text-[#F04452] mb-5 shadow-2xs">
            <UserX className="w-8 h-8 stroke-[2.2]" />
          </div>

          {/* Status Badge */}
          <span className="text-[12px] font-bold tracking-wider text-[#F04452] bg-[#FFF0F2] px-2.5 py-1 rounded-full mb-3">
            404 NOT FOUND
          </span>

          <h1 className="text-[20px] font-bold text-[#191F28] tracking-tight mb-2">
            페이지를 찾을 수 없어요
          </h1>

          <p className="text-[14px] text-[#6B7684] leading-relaxed mb-6">
            요청하신 주소가 올바르지 않거나 존재하지 않는 페이지예요.
          </p>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            <Link href="/" className="w-full">
              <Button
                variant="default"
                size="lg"
                className="w-full h-11 rounded-xl text-[14px] font-bold bg-[#3182F6] hover:bg-[#1B64DA] text-white shadow-xs gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>MyLink 홈으로 가기</span>
              </Button>
            </Link>

            <Link href="/edit" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-11 rounded-xl text-[14px] font-semibold text-[#4E5968] hover:text-[#191F28] border-[#E5E8EB] bg-white gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#3182F6]" />
                <span>나만의 링크 페이지 만들기</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer info */}
        <footer className="text-center mt-6 text-[12px] text-[#8B95A1]">
          <p>© 2026 MyLink · 사용자 프로필 검색 서비스</p>
        </footer>
      </main>
    </div>
  );
}
