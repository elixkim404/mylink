import Link from "next/link";
import { UserX, Home, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function NotFound() {
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
            사용자를 찾을 수 없어요
          </h1>

          <p className="text-[14px] text-[#6B7684] leading-relaxed mb-6">
            요청하신 <span className="font-semibold text-[#191F28]">displayName</span>의 유저가 존재하지 않거나 주소가 올바르지 않아요.
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
