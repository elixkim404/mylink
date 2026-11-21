import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Link2,
  BarChart3,
  Globe,
  Sparkles,
  CheckCircle2,
  MousePointerClick,
  QrCode,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentBg: string;
  preview: React.ReactNode;
}

const FEATURES: FeatureItem[] = [
  {
    title: "링크 관리",
    description:
      "SNS, 포트폴리오, 블로그 등 원하는 링크를 손쉽게 추가·수정하고 한곳에서 깔끔하게 관리할 수 있어요.",
    icon: <Link2 className="w-5 h-5 text-[#3182F6]" />,
    accentBg: "bg-[#E8F3FF]",
    preview: (
      <div className="mt-auto pt-3 border-t border-[#F2F4F6] flex flex-col gap-1.5">
        <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] px-2.5 py-1.5 text-[12px]">
          <span className="font-medium text-[#333D4B] truncate">GitHub 포트폴리오</span>
          <span className="w-7 h-4 rounded-full bg-[#3182F6] flex items-center justify-end px-0.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-white" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] px-2.5 py-1.5 text-[12px]">
          <span className="font-medium text-[#333D4B] truncate">노션 이력서</span>
          <span className="w-7 h-4 rounded-full bg-[#3182F6] flex items-center justify-end px-0.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-white" />
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "클릭 통계",
    description:
      "방문자가 어떤 링크를 얼마나 클릭했는지 누적 조회수와 통계 데이터로 한눈에 확인해 보세요.",
    icon: <BarChart3 className="w-5 h-5 text-[#2B9D5B]" />,
    accentBg: "bg-[#E6F7ED]",
    preview: (
      <div className="mt-auto pt-3 border-t border-[#F2F4F6] flex items-end justify-between gap-2">
        <div className="flex items-end gap-1.5 h-10">
          <span className="w-2.5 h-4 rounded-t bg-[#D1E9DA]" />
          <span className="w-2.5 h-7 rounded-t bg-[#74C997]" />
          <span className="w-2.5 h-10 rounded-t bg-[#2B9D5B]" />
          <span className="w-2.5 h-6 rounded-t bg-[#74C997]" />
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2B9D5B] bg-[#E6F7ED] px-2 py-1 rounded-full">
          <MousePointerClick className="w-3 h-3" />
          <span>+128 클릭</span>
        </span>
      </div>
    ),
  },
  {
    title: "개인 url",
    description:
      "나만의 고유한 개인 url과 QR 코드를 발급받아 프로필과 명함에 바로 공유할 수 있어요.",
    icon: <Globe className="w-5 h-5 text-[#7C3AED]" />,
    accentBg: "bg-[#F3EEFF]",
    preview: (
      <div className="mt-auto pt-3 border-t border-[#F2F4F6] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E8EB] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-[#4E5968] truncate flex-1">
          <span className="text-[#7C3AED] font-bold">/</span>
          <span className="truncate">mylink/@me</span>
        </div>
        <span className="w-8 h-8 rounded-lg bg-[#F3EEFF] text-[#7C3AED] flex items-center justify-center shrink-0">
          <QrCode className="w-4 h-4" />
        </span>
      </div>
    ),
  },
];

const STEPS = [
  {
    step: "01",
    title: "Google로 간편 로그인",
    description: "복잡한 회원가입 절차 없이 10초 만에 계정을 연결하세요.",
  },
  {
    step: "02",
    title: "내 링크 등록 & 정리",
    description: "자주 쓰는 채널과 소개 문구를 카드 형태로 깔끔하게 채워요.",
  },
  {
    step: "03",
    title: "개인 URL과 QR로 공유",
    description: "인스타그램, 명함, 블로그 어디든 링크 하나로 연결하세요.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col selection:bg-[#3182F6] selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-md border-b border-[#E5E8EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-[17px] tracking-tight text-[#191F28]"
          >
            <span className="w-7 h-7 rounded-lg bg-[#3182F6] text-white flex items-center justify-center text-[13px] font-extrabold shadow-xs">
              M
            </span>
            <span>마이링크</span>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href="#features"
              className="hidden sm:inline-flex text-[13px] font-medium text-[#4E5968] hover:text-[#191F28] px-3 py-1.5 rounded-lg hover:bg-[#F2F4F6] transition-colors"
            >
              주요 기능
            </a>
            <a
              href="#how-it-works"
              className="hidden sm:inline-flex text-[13px] font-medium text-[#4E5968] hover:text-[#191F28] px-3 py-1.5 rounded-lg hover:bg-[#F2F4F6] transition-colors"
            >
              이용 방법
            </a>
            <Link href="/login">
              <Button variant="brandWeak" size="sm" className="font-bold">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero Section (Responsive 2-column on desktop) */}
        <section className="py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left: Copy & CTA */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Badge
              variant="brand"
              className="mb-4 px-3 py-1 text-[12px] font-semibold gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>간편한 퍼블릭 링크 프로필</span>
            </Badge>

            <h1 className="text-[40px] sm:text-[52px] font-extrabold tracking-tight text-[#191F28] leading-[1.12]">
              마이링크
            </h1>

            <p className="mt-3.5 text-[20px] sm:text-[26px] font-bold text-[#333D4B] tracking-tight leading-snug">
              나만의 링크 페이지를 30분 만에
            </p>

            <p className="mt-3 max-w-lg text-[15px] sm:text-[16px] text-[#6B7684] leading-relaxed">
              흩어져 있는 SNS, 포트폴리오, 블로그를 단 하나의 페이지에 담아보세요.
              복잡한 설정 없이 누구나 빠르게 만들고 공유할 수 있습니다.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="xl" className="w-full sm:w-auto px-8 shadow-sm">
                  <span>시작하기</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto px-6 bg-white"
                >
                  기능 살펴보기
                </Button>
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-[12px] text-[#6B7684] font-medium">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3182F6]" />
                무료로 시작
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3182F6]" />
                모바일 최적화
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3182F6]" />
                실시간 클릭 집계
              </span>
            </div>
          </div>

          {/* Right: Interactive-style Phone Mockup Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[330px] rounded-[28px] bg-white border border-[#E5E8EB] shadow-[0_16px_40px_rgba(25,31,40,0.08)] p-4 relative">
              {/* Top Browser/URL Pill */}
              <div className="flex items-center justify-between bg-[#F2F4F6] rounded-full px-3 py-1.5 mb-4 text-[11px] text-[#4E5968]">
                <span className="inline-flex items-center gap-1.5 font-medium truncate">
                  <span className="w-2 h-2 rounded-full bg-[#2B9D5B]" />
                  <span className="truncate">mylink.vercel.app/@yehyun</span>
                </span>
                <QrCode className="w-3.5 h-3.5 text-[#8B95A1] shrink-0" />
              </div>

              {/* Mini Profile */}
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-linear-to-tr from-[#3182F6] to-[#60A5FA] text-white font-extrabold text-[20px] flex items-center justify-center shadow-sm mb-2.5">
                  M
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[16px] text-[#191F28]">김예현</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F3FF] text-[#3182F6]">
                    Creator
                  </span>
                </div>
                <p className="text-[12px] text-[#6B7684] mt-1">
                  개발과 디자인을 기록하는 공간 ✨
                </p>
              </div>

              {/* Mini Sample Link Cards */}
              <div className="flex flex-col gap-2">
                {[
                  { label: "포트폴리오 웹사이트", clicks: "342" },
                  { label: "기술 블로그 & 회고", clicks: "198" },
                  { label: "인스타그램 @yehyun", clicks: "124" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group flex items-center justify-between rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] hover:bg-[#E8F3FF]/50 hover:border-[#3182F6]/40 px-3.5 py-2.5 transition-all"
                  >
                    <span className="text-[13px] font-semibold text-[#191F28] truncate">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-semibold text-[#8B95A1] tabular-nums">
                        {item.clicks}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#8B95A1] group-hover:text-[#3182F6] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Live Badge */}
              <div className="hidden sm:flex absolute -bottom-3 -right-3 bg-[#191F28] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#FFD43B]" />
                <span>실시간 반영 중</span>
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Stats Strip */}
        <section className="py-4">
          <div className="rounded-[28px] bg-white border border-[#E5E8EB] shadow-[0_12px_32px_rgba(25,31,40,0.05)] p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#F2F4F6] text-center">
            <div className="flex flex-col items-center pt-1 sm:pt-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F3FF] text-[#3182F6] mb-2">
                빠른 시작
              </span>
              <p className="text-[24px] sm:text-[28px] font-extrabold text-[#191F28] tracking-tight">
                30분 완성
              </p>
              <p className="text-[13px] text-[#6B7684] mt-1 font-medium">
                누구나 뚝딱 완성하는 나만의 페이지
              </p>
            </div>
            <div className="flex flex-col items-center pt-5 sm:pt-0 sm:pl-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E6F7ED] text-[#2B9D5B] mb-2">
                실시간 분석
              </span>
              <p className="text-[24px] sm:text-[28px] font-extrabold text-[#191F28] tracking-tight">
                클릭 집계
              </p>
              <p className="text-[13px] text-[#6B7684] mt-1 font-medium">
                링크 클릭 수와 방문 반응 즉시 반영
              </p>
            </div>
            <div className="flex flex-col items-center pt-5 sm:pt-0 sm:pl-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3EEFF] text-[#7C3AED] mb-2">
                어디서나
              </span>
              <p className="text-[24px] sm:text-[28px] font-extrabold text-[#191F28] tracking-tight">
                1개의 URL
              </p>
              <p className="text-[13px] text-[#6B7684] mt-1 font-medium">
                모바일·PC 어디서나 깨짐 없는 반응형
              </p>
            </div>
          </div>
        </section>

        {/* Feature Cards Section (3 Cards) */}
        <section id="features" className="py-14 sm:py-18">
          <div className="text-center flex flex-col items-center mb-10">
            <Badge
              variant="brand"
              className="mb-3 px-3 py-1 text-[12px] font-semibold gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>핵심 기능</span>
            </Badge>
            <h2 className="text-[26px] sm:text-[34px] font-extrabold text-[#191F28] tracking-tight">
              꼭 필요한 기능만 깔끔하게
            </h2>
            <p className="mt-2.5 text-[14px] sm:text-[16px] text-[#6B7684] max-w-md">
              링크 모음부터 클릭 분석, 개인 url 공유까지 마이링크 하나로 충분해요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="rounded-[28px] bg-white border border-[#E5E8EB] shadow-[0_12px_32px_rgba(25,31,40,0.05)] p-6 flex flex-col gap-3.5 hover:border-[#3182F6]/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(25,31,40,0.08)] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl ${feature.accentBg} flex items-center justify-center`}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-[#8B95A1] bg-[#F2F4F6] px-2.5 py-1 rounded-full">
                    MyLink
                  </span>
                </div>
                <h3 className="text-[19px] font-bold text-[#191F28] tracking-tight mt-1">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-[#6B7684] leading-relaxed">
                  {feature.description}
                </p>
                {feature.preview}
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section (3 Steps) */}
        <section id="how-it-works" className="pb-16 sm:pb-20">
          <div className="text-center flex flex-col items-center mb-10">
            <Badge
              variant="brand"
              className="mb-3 px-3 py-1 text-[12px] font-semibold gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>이용 방법</span>
            </Badge>
            <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#191F28] tracking-tight">
              이렇게 시작해 보세요
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-[28px] bg-white border border-[#E5E8EB] shadow-[0_12px_32px_rgba(25,31,40,0.05)] p-6 flex flex-col gap-3 hover:border-[#3182F6]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#E8F3FF] text-[#3182F6] font-extrabold text-[12px]">
                    STEP {item.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#3182F6]/40" />
                </div>
                <h3 className="text-[17px] font-bold text-[#191F28] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#6B7684] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="pb-20">
          <div className="rounded-[28px] bg-white border border-[#E5E8EB] shadow-[0_16px_40px_rgba(25,31,40,0.07)] p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center sm:items-start">
              <Badge
                variant="brand"
                className="mb-3 px-3 py-1 text-[12px] font-semibold gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>지금 바로 시작하기</span>
              </Badge>
              <h2 className="text-[22px] sm:text-[28px] font-extrabold text-[#191F28] tracking-tight">
                나만의 링크 페이지를 만들어 보세요
              </h2>
              <p className="mt-1.5 text-[14px] sm:text-[15px] text-[#6B7684]">
                Google 로그인 후 30분 안에 멋진 퍼블릭 프로필을 완성할 수 있어요.
              </p>
            </div>

            <Link href="/login" className="relative z-10 shrink-0 w-full sm:w-auto">
              <Button
                size="xl"
                className="w-full sm:w-auto px-8 shadow-sm"
              >
                <span>시작하기</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <div className="absolute -bottom-14 -right-14 w-44 h-44 rounded-full bg-[#E8F3FF] blur-2xl pointer-events-none" />
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
