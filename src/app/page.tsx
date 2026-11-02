"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  QrCode,
  Sparkles,
  Check,
  Coffee,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { MyLinkData, LinkItem, CheerMessage } from "../types/mylink";
import {
  getStoredMyLinkData,
  saveStoredMyLinkData,
  DEFAULT_MYLINK_DATA,
} from "../lib/storage";
import { ProfileHero } from "../components/ProfileHero";
import { LinkCard } from "../components/LinkCard";
import { QRCodeModal } from "../components/QRCodeModal";
import { CheerSection } from "../components/CheerSection";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function PublicProfilePage() {
  const [data, setData] = useState<MyLinkData>(DEFAULT_MYLINK_DATA);
  const [showQrModal, setShowQrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasCheered, setHasCheered] = useState(false);

  // Load data from localStorage on mount (Phase 0 spec)
  useEffect(() => {
    const stored = getStoredMyLinkData();
    setData(stored);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "https://mylink.app";
    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${data.profile.display_name} | 마이링크`,
          text: `${data.profile.display_name}의 프로필 링크 목록이에요 🐣`,
          url: shareUrl,
        });
      } else if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(shareUrl);
        showToast("프로필 링크가 복사되었어요 🔗");
      }
    } catch {
      // User cancelled
    }
  };

  const handleCopyHandle = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(`@${data.profile.handle}`);
      showToast("아이디가 복사되었어요 📋");
    }
  };

  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCheerHeart = () => {
    if (!hasCheered) {
      const updatedCount = (data.cheer_count || 168) + 1;
      const updatedData = { ...data, cheer_count: updatedCount };
      setData(updatedData);
      saveStoredMyLinkData(updatedData);
      setHasCheered(true);
      showToast("예현이에게 따뜻한 응원을 보냈어요 ❤️");
    } else {
      const updatedCount = Math.max(0, (data.cheer_count || 168) - 1);
      const updatedData = { ...data, cheer_count: updatedCount };
      setData(updatedData);
      saveStoredMyLinkData(updatedData);
      setHasCheered(false);
    }
  };

  const handleAddCheer = (author: string, content: string) => {
    const newCheer: CheerMessage = {
      id: `cheer-${Date.now()}`,
      author,
      content,
      time: "방금 전",
    };
    const updatedCheers = [newCheer, ...(data.cheers || [])];
    const updatedData = { ...data, cheers: updatedCheers };
    setData(updatedData);
    saveStoredMyLinkData(updatedData);
    showToast("응원 메시지가 등록되었어요 ✨");
  };

  const handleLinkClick = (clickedLink: LinkItem) => {
    const updatedLinks = data.links.map((link) =>
      link.id === clickedLink.id
        ? { ...link, click_count: (link.click_count || 0) + 1 }
        : link
    );
    setData((prev) => ({ ...prev, links: updatedLinks }));
  };

  // Filter active links and sort by sort_order (F-04, F-07)
  const activeLinks = data.links
    .filter((l) => l.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center pb-24 selection:bg-[#3182F6] selection:text-white">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#191F28] text-white px-4 py-2.5 rounded-full shadow-[0_8px_24px_rgba(25,31,40,0.2)] flex items-center gap-2 text-[14px] font-medium">
            <span className="w-4 h-4 rounded-full bg-[#2B9D5B] flex items-center justify-center text-white shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Top Navigation Bar (Mobile Viewport: max-w-[430px]) */}
      <header className="sticky top-0 z-30 w-full max-w-[430px] bg-[#F9FAFB]/90 backdrop-blur-md px-5 h-14 flex items-center justify-between border-b border-[#E5E8EB]/50">
        <button
          onClick={handleScrollToTop}
          className="flex items-center gap-1.5 text-left group cursor-pointer outline-hidden"
        >
          <span className="font-bold text-[17px] text-[#191F28] group-hover:text-[#3182F6] transition-colors">
            @{data.profile.handle}
          </span>
          <ShieldCheck className="w-4 h-4 text-[#3182F6]" />
        </button>

        <div className="flex items-center gap-2">
          {/* QR Button using shadcn Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowQrModal(true)}
            className="rounded-full shadow-2xs"
            title="QR 코드 보기"
            aria-label="QR 코드 보기"
          >
            <QrCode className="w-4 h-4 text-[#4E5968]" />
          </Button>

          {/* Share Button using shadcn Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="rounded-full shadow-2xs"
            title="프로필 공유하기"
            aria-label="프로필 공유하기"
          >
            <Share2 className="w-4 h-4 text-[#4E5968]" />
          </Button>
        </div>
      </header>

      {/* Main Container (Mobile 375px ~ 430px viewport) */}
      <main className="w-full max-w-[430px] px-5 py-5 flex flex-col gap-4">
        {/* 2. Profile Hero Section */}
        <ProfileHero
          profile={data.profile}
          onCopyHandle={handleCopyHandle}
          onShowToast={showToast}
        />

        {/* 3. Active Links Container */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1 pt-2 pb-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[17px] font-bold text-[#191F28] tracking-tight">
                링크 목록
              </h2>
              <Badge variant="brand" className="text-[11px] px-2 py-0.5 tabular-nums">
                {activeLinks.length}개
              </Badge>
            </div>
            <span className="text-[12px] text-[#8B95A1]">
              탭하면 바로 연결돼요
            </span>
          </div>

          {/* Links List */}
          {activeLinks.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {activeLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onLinkClick={handleLinkClick}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-[#8B95A1]">
              <p className="text-[14px]">현재 노출 중인 링크가 없어요.</p>
            </Card>
          )}
        </section>

        {/* 4. Campus Daily Snapshots (공부 및 일상 갤러리) */}
        <Card className="p-5 text-left">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[17px] font-bold text-[#191F28] tracking-tight">
                새내기 코딩 일상
              </h2>
              <p className="text-[12px] text-[#8B95A1]">
                도서관과 캠퍼스에서 차근차근 기록하는 하루예요
              </p>
            </div>
            <Badge variant="success" className="text-[11px] px-2 py-0.5">
              Campus 🌿
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl overflow-hidden bg-[#F2F4F6] aspect-4/3 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/workspace.jpg"
                alt="캠퍼스 코딩 공간"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 bg-[#191F28]/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                강의실 코딩 💻
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#F2F4F6] aspect-4/3 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/coding.jpg"
                alt="도서관 코딩 세션"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 bg-[#191F28]/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                도서관 열람실 ☕
              </div>
            </div>
          </div>
        </Card>

        {/* 5. Interactive Section : 응원 남기기 */}
        <CheerSection
          cheerCount={data.cheer_count || 168}
          cheers={data.cheers || []}
          onAddCheer={handleAddCheer}
          onCheerClick={handleCheerHeart}
          hasCheered={hasCheered}
        />

        {/* 6. Viral Footer Banner (TDS Banner CTA) */}
        <section className="bg-linear-to-r from-[#3182F6] to-[#1B64DA] rounded-2xl p-5 text-white shadow-md text-left relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold mb-2">
              <Sparkles className="w-3 h-3" />
              <span>간편한 링크 모음</span>
            </div>
            <h3 className="text-[17px] font-bold leading-snug mb-1">
              나도 30초 만에 MyLink 무료로 만들기
            </h3>
            <p className="text-[13px] text-white/80 mb-3.5 leading-snug">
              내 채널과 포트폴리오를 하나의 링크로 모아보세요.
            </p>
            <Button
              onClick={() => showToast("MyLink 온보딩 서비스 준비 중이에요 🚀")}
              variant="outline"
              size="sm"
              className="bg-white text-[#3182F6] hover:bg-[#F2F4F6] border-0 font-bold"
            >
              <span>지금 시작하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </section>

        {/* Footer info */}
        <footer className="text-center py-6 text-[12px] text-[#8B95A1] leading-relaxed">
          <p>© 2026 MyLink · Privacy · Terms</p>
          <p className="text-[11px] text-[#B0B8C1] mt-0.5">
            토스 디자인 시스템(TDS) 스타일 가이드 준수
          </p>
        </footer>
      </main>

      {/* 7. QR Code Popup Modal */}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        displayName={data.profile.display_name}
        handle={data.profile.handle}
        onCopySuccess={() => showToast("프로필 주소가 복사되었어요 📋")}
      />

      {/* Floating Bottom Action Bar using Tailwind & shadcn Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
        {/* Scrim protection gradient */}
        <div className="w-full h-8 bg-linear-to-t from-[#F9FAFB] to-transparent pointer-events-none" />

        <div className="w-full max-w-[430px] px-5 pb-4 bg-[#F9FAFB] pointer-events-auto">
          {data.profile.socials?.email ? (
            <a
              href={data.profile.socials.email}
              className="block w-full"
            >
              <Button
                variant="default"
                size="xl"
                className="w-full shadow-sm cursor-pointer"
              >
                <Coffee className="w-5 h-5" />
                <span>{data.profile.display_name} 님과 커피챗 신청하기</span>
              </Button>
            </a>
          ) : (
            <Button
              onClick={handleShare}
              variant="default"
              size="xl"
              className="w-full shadow-sm cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              <span>이 프로필 공유하기</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
