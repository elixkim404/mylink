import React from "react";
import Link from "next/link";
import { ArrowRight, Link2, BarChart3, Globe, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentBg: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: "링크 관리",
    description:
      "SNS, 포트폴리오, 블로그 등 원하는 링크를 손쉽게 추가·수정하고 한곳에서 깔끔하게 관리할 수 있어요.",
    icon: <Link2 className="w-5 h-5 text-[#3182F6]" />,
    accentBg: "bg-[#E8F3FF]",
  },
  {
    title: "클릭 통계",
    description:
      "방문자가 어떤 링크를 얼마나 클릭했는지 누적 조회수와 통계 데이터로 한눈에 확인해 보세요.",
    icon: <BarChart3 className="w-5 h-5 text-[#2B9D5B]" />,
    accentBg: "bg-[#E6F7ED]",
  },
  {
    title: "개인 url",
    description:
      "나만의 고유한 개인 url과 QR 코드를 발급받아 프로필과 명함에 바로 공유할 수 있어요.",
    icon: <Globe className="w-5 h-5 text-[#7C3AED]" />,
    accentBg: "bg-[#F3EEFF]",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col selection:bg-[#3182F6] selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-[#E5E8EB]">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[17px] tracking-tight text-[#191F28]">
            <span className="w-7 h-7 rounded-lg bg-[#3182F6] text-white flex items-center justify-center text-[13px] font-extrabold">
              M
            </span>
            <span>마이링크</span>
          </Link>

          <Link href="/login">
            <Button variant="brandWeak" size="sm" className="font-bold">
              시작하기
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-5">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 text-center flex flex-col items-center">
          <Badge variant="brand" className="mb-5 px-3 py-1 text-[12px] font-semibold gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>간편한 퍼블릭 링크 프로필</span>
          </Badge>

          <h1 className="text-[40px] sm:text-[54px] font-extrabold tracking-tight text-[#191F28] leading-[1.15]">
            마이링크
          </h1>

          <p className="mt-4 text-[20px] sm:text-[26px] font-bold text-[#333D4B] tracking-tight leading-snug">
            나만의 링크 페이지를 30분 만에
          </p>

          <p className="mt-3 max-w-md text-[15px] sm:text-[16px] text-[#6B7684] leading-relaxed">
            흩어져 있는 모든 채널과 콘텐츠를 단 하나의 링크에 담아보세요.
            복잡한 설정 없이 누구나 빠르게 시작할 수 있습니다.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/login">
              <Button size="xl" className="px-8 shadow-sm">
                <span>시작하기</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Cards Section (3 Cards) */}
        <section className="pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 flex flex-col gap-3.5 hover:border-[#D1D6DB] hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)] transition-all"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${feature.accentBg} flex items-center justify-center`}
                >
                  {feature.icon}
                </div>
                <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-[14px] text-[#6B7684] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E8EB] bg-white py-8 text-center text-[12px] text-[#8B95A1]">
        <p>© 2026 마이링크 (MyLink). All rights reserved.</p>
      </footer>
    </div>
  );
}
