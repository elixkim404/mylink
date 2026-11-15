"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Share2,
  Sparkles,
  Check,
  Coffee,
  ArrowRight,
  Plus,
  Lock,
} from "lucide-react";
import { MyLinkData, LinkItem, CheerMessage, ProfileData } from "../types/mylink";
import {
  getStoredMyLinkData,
  saveStoredMyLinkData,
  DEFAULT_MYLINK_DATA,
} from "../lib/storage";
import { getTimestampNumber } from "../lib/firebaseLinks";
import {
  useLinksQuery,
  useAddLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
  useClickLinkMutation,
} from "../lib/useLinks";
import { getUserProfileFullUrl, getBaseAppUrl, withBasePath } from "../lib/urls";
import { useAuth } from "../lib/authContext";
import { Header } from "../components/Header";
import { ProfileHero } from "../components/ProfileHero";
import { LinkCard } from "../components/LinkCard";
import { QRCodeModal } from "../components/QRCodeModal";
import { AddLinkDialog } from "../components/AddLinkDialog";
import { DeleteLinkDialog } from "../components/DeleteLinkDialog";
import { CheerSection } from "../components/CheerSection";
import { LoginNoticeCard } from "../components/LoginNoticeCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function PublicProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth();

  const { data: remoteLinks, isLoading: isLinksQueryLoading } = useLinksQuery(user?.uid);
  const addLinkMutation = useAddLinkMutation(user?.uid);
  const updateLinkMutation = useUpdateLinkMutation(user?.uid);
  const deleteLinkMutation = useDeleteLinkMutation(user?.uid);
  const clickLinkMutation = useClickLinkMutation(user?.uid);

  const [data, setData] = useState<MyLinkData>(DEFAULT_MYLINK_DATA);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasCheered, setHasCheered] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // 로그인 유저의 최신 프로필 정보 또는 로컬스토리지 프로필을 파생 상태로 계산
  const currentProfile: ProfileData = React.useMemo(() => {
    if (user && userProfile) {
      const emailPrefix = (userProfile.email || user.email || "").split("@")[0];
      const resolvedDisplayName =
        userProfile.display_name && userProfile.display_name !== user.displayName
          ? userProfile.display_name
          : emailPrefix || "마이링크 회원";

      return {
        uid: user.uid,
        email: userProfile.email || user.email || undefined,
        handle: userProfile.handle || emailPrefix || "me",
        display_name: resolvedDisplayName,
        badge: userProfile.badge || "Google 연동",
        bio: userProfile.bio || "안녕하세요! 마이링크에 오신 것을 환영해요 ✨",
        avatar_url: userProfile.avatar_url || user.photoURL || "/images/avatar.svg",
        socials: userProfile.socials || {
          email: user.email ? `mailto:${user.email}` : undefined,
        },
      };
    }
    return data.profile;
  }, [user, userProfile, data.profile]);

  // 비로그인 상태일 때 로컬스토리지 데이터 로드
  useEffect(() => {
    if (!authLoading && !user) {
      const stored = getStoredMyLinkData();
      queueMicrotask(() => {
        setData(stored);
      });
    }
  }, [user, authLoading]);

  // 외부(다른 탭 등)에서 프로필 수정 시 동기화
  useEffect(() => {
    const handleSync = () => {
      if (!user) {
        const latest = getStoredMyLinkData();
        setData((prev) => ({
          ...prev,
          profile: latest.profile,
        }));
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleSync);
      window.addEventListener("storage", handleSync);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleSync);
        window.removeEventListener("storage", handleSync);
      }
    };
  }, [user]);

  const handleShare = async () => {
    // user id 기반의 실제 서비스 공유 URL 생성 (더 이상 localhost 링크가 복사되지 않음)
    const shareUrl = user?.uid ? getUserProfileFullUrl(user.uid) : getBaseAppUrl();
    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${currentProfile.display_name} | 마이링크`,
          text: `${currentProfile.display_name}의 프로필 링크 목록이에요 🐣`,
          url: shareUrl,
        });
      } else if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(shareUrl);
        showToast("프로필 링크가 복사되었어요 🔗");
      }
    } catch {
      // 사용자가 공유 창을 닫은 경우 무시
    }
  };

  const handleCopyHandle = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(`@${currentProfile.handle}`);
      showToast("아이디가 복사되었어요 📋");
    }
  };

  const handleCheerHeart = () => {
    if (!hasCheered) {
      const updatedCount = (data.cheer_count || 168) + 1;
      const updatedData = { ...data, cheer_count: updatedCount };
      setData(updatedData);
      if (!user) saveStoredMyLinkData(updatedData);
      setHasCheered(true);
      showToast("따뜻한 응원을 보냈어요 ❤️");
    } else {
      const updatedCount = Math.max(0, (data.cheer_count || 168) - 1);
      const updatedData = { ...data, cheer_count: updatedCount };
      setData(updatedData);
      if (!user) saveStoredMyLinkData(updatedData);
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
    if (!user) saveStoredMyLinkData(updatedData);
    showToast("응원 메시지가 등록되었어요 ✨");
  };

  // 로그인 여부에 따른 활성 링크 소스 결정 (로그인 시 TanStack Query 캐시, 비로그인 시 로컬스토리지)
  const currentLinks = user ? (remoteLinks ?? []) : data.links;
  const isLoadingLinks = user ? isLinksQueryLoading : false;

  // 링크 클릭 시 (클릭 수 증가 - TanStack Query 낙관적 카운트업)
  const handleLinkClick = (clickedLink: LinkItem) => {
    if (user) {
      clickLinkMutation.mutate(clickedLink.id);
    } else {
      const updatedLinks = data.links.map((link) =>
        link.id === clickedLink.id
          ? { ...link, click_count: (link.click_count || 0) + 1 }
          : link
      );
      const updatedData = { ...data, links: updatedLinks };
      setData(updatedData);
      saveStoredMyLinkData(updatedData);
    }
  };

  // 새 링크 추가 모달 열기 요청
  const handleRequestAddLink = () => {
    if (!user) {
      showToast("로그인 후 나만의 링크를 추가할 수 있어요. 상단에서 Google 로그인을 진행해주세요 🔒");
      return;
    }
    setShowAddModal(true);
  };

  // 새 링크 추가 처리 (TanStack Query 낙관적 추가 + 에러 시 자동 롤백)
  const handleAddLink = async (newLinkData: Omit<LinkItem, "id" | "click_count">) => {
    const rawUrl = (newLinkData.url || "").trim();
    const rawTitle = (newLinkData.title || "").trim();

    if (!rawUrl || rawUrl === "https://" || rawUrl === "http://" || !rawTitle) {
      showToast("올바른 링크 주소와 제목을 입력해주세요 ⚠️");
      return;
    }

    if (!user) {
      showToast("로그인이 필요합니다. Google 소셜 로그인 후 링크를 저장해주세요 🔒");
      return;
    }

    try {
      await addLinkMutation.mutateAsync(newLinkData);
      showToast("새 링크가 안전하게 저장되었어요 ✨");
    } catch (error) {
      console.error("링크 저장 실패:", error);
      showToast("링크 저장 중 오류가 발생했어요 ⚠️");
    }
  };

  // 링크 수정 처리 (TanStack Query 낙관적 수정 + 에러 시 자동 롤백)
  const handleUpdateLink = async (
    linkId: string,
    updatedFields: Partial<Omit<LinkItem, "id">>
  ) => {
    if (!user) {
      showToast("로그인 후 링크를 수정할 수 있어요 🔒");
      return;
    }

    try {
      await updateLinkMutation.mutateAsync({ linkId, updatedFields });
      showToast("링크가 성공적으로 수정되었어요 ✨");
    } catch (error) {
      console.error("링크 수정 실패:", error);
      showToast("링크 수정 중 오류가 발생했어요 ⚠️");
    }
  };

  // 링크 삭제 처리 (TanStack Query 낙관적 삭제 + 에러 시 자동 롤백)
  const handleDeleteLink = async (linkId: string) => {
    if (!user) {
      showToast("로그인 후 링크를 삭제할 수 있어요 🔒");
      return;
    }

    try {
      await deleteLinkMutation.mutateAsync(linkId);
      showToast("링크가 삭제되었어요 🗑️");
    } catch (error) {
      console.error("링크 삭제 실패:", error);
      showToast("링크 삭제 중 오류가 발생했어요 ⚠️");
    }
  };

  const handleRequestDelete = (link: LinkItem) => {
    if (!user) {
      showToast("로그인 후 링크를 관리할 수 있어요 🔒");
      return;
    }
    setDeletingLink(link);
    setShowDeleteModal(true);
  };

  // 활성화된 링크 필터 및 최신순 정렬
  const activeLinks = currentLinks
    .filter((l) => l.is_active)
    .sort((a, b) => {
      const timeA = getTimestampNumber(a.createdAt);
      const timeB = getTimestampNumber(b.createdAt);
      if (timeA !== timeB) {
        return timeB - timeA; // 최신순 (내림차순)
      }
      return (a.sort_order ?? 1) - (b.sort_order ?? 1);
    });

  // 누적 클릭 수 계산
  const totalClicks = currentLinks.reduce((acc, curr) => acc + (curr.click_count || 0), 0);

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

      {/* 1. Header with Google Social Login & Profile Dropdown */}
      <Header
        onOpenQr={() => setShowQrModal(true)}
        onShare={handleShare}
        onShowToast={showToast}
        linksCount={activeLinks.length}
        totalClicks={totalClicks}
      />

      {/* Main Container (Mobile 375px ~ 430px viewport) */}
      <main className="w-full max-w-[430px] px-5 py-5 flex flex-col gap-4">
        {/* 비로그인 상태일 때: 상단 설명 문구 및 로그인 유도 온보딩 카드 */}
        {!authLoading && !user && (
          <LoginNoticeCard onShowToast={showToast} />
        )}

        {/* 2. Profile Hero Section (로그인 시 users/(user.uid)의 유저 정보 표시) */}
        <ProfileHero
          profile={currentProfile}
          onCopyHandle={handleCopyHandle}
          onShowToast={showToast}
        />

        {/* 3. Active Links Container */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1 pt-2 pb-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[17px] font-bold text-[#191F28] tracking-tight">
                {user ? "내 링크 목록" : "둘러보기 링크"}
              </h2>
              <Badge variant="brand" className="text-[11px] px-2 py-0.5 tabular-nums">
                {activeLinks.length}개
              </Badge>
            </div>

            {/* [+ 새 링크 추가] Button */}
            <Button
              onClick={handleRequestAddLink}
              variant="brandWeak"
              size="sm"
              className="h-8 px-2.5 rounded-full text-[12px] font-bold gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>새 링크 추가</span>
            </Button>
          </div>

          {/* Links List State */}
          {isLoadingLinks ? (
            <Card className="p-8 text-center text-[#8B95A1] flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-[#3182F6] border-t-transparent rounded-full animate-spin" />
              <p className="text-[13px] font-medium text-[#4E5968]">
                Firestore에서 링크를 불러오는 중이에요...
              </p>
            </Card>
          ) : activeLinks.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {activeLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onLinkClick={handleLinkClick}
                  onUpdateLink={handleUpdateLink}
                  onRequestDelete={handleRequestDelete}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-[#8B95A1] flex flex-col items-center gap-3">
              <p className="text-[14px]">
                {user
                  ? "아직 등록된 링크가 없어요. 첫 링크를 추가해보세요!"
                  : "현재 노출 중인 링크가 없어요."}
              </p>
              <Button
                onClick={handleRequestAddLink}
                variant="default"
                size="sm"
                className="rounded-xl font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>첫 링크 추가하기</span>
              </Button>
            </Card>
          )}

          {/* 비로그인 상태일 때 링크 목록 하단 안내 */}
          {!authLoading && !user && (
            <div className="bg-[#F2F4F6] rounded-xl p-3 flex items-center justify-between text-[12px] text-[#4E5968] mt-1 border border-[#E5E8EB]">
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#8B95A1]" />
                로그인하면 내 링크를 직접 등록하고 관리할 수 있어요
              </span>
              <Link href="/edit" className="text-[#3182F6] font-semibold hover:underline shrink-0 ml-2">
                마이페이지 안내 &gt;
              </Link>
            </div>
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
                src={withBasePath("/images/workspace.jpg")}
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
                src={withBasePath("/images/coding.jpg")}
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
            <Link href="/edit">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-[#3182F6] hover:bg-[#F2F4F6] border-0 font-bold"
              >
                <span>마이페이지 시작하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
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

      {/* 7. QR Code Popup Modal (user id 기반 URL 전달) */}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        displayName={currentProfile.display_name}
        handle={currentProfile.handle}
        url={user?.uid ? getUserProfileFullUrl(user.uid) : getBaseAppUrl()}
        onCopySuccess={() => showToast("프로필 주소가 복사되었어요 📋")}
      />

      {/* 8. Add Link Dialog */}
      <AddLinkDialog
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddLink={handleAddLink}
      />

      {/* 9. Delete Confirmation Dialog */}
      <DeleteLinkDialog
        isOpen={showDeleteModal}
        link={deletingLink}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingLink(null);
        }}
        onConfirmDelete={handleDeleteLink}
      />

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
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
