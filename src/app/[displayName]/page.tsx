"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  Plus,
  Loader2,
  Sparkles,
  ArrowRight,
  UserX,
} from "lucide-react";
import { LinkItem, CheerMessage, ProfileData } from "../../types/mylink";
import { getTimestampNumber } from "../../lib/firebaseLinks";
import {
  useLinksQuery,
  useAddLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
  useClickLinkMutation,
} from "../../lib/useLinks";
import { useProfileByDisplayNameQuery } from "../../lib/useProfile";
import { useAuth } from "../../lib/authContext";
import { Header } from "../../components/Header";
import { ProfileHero } from "../../components/ProfileHero";
import { LinkCard } from "../../components/LinkCard";
import { QRCodeModal } from "../../components/QRCodeModal";
import { AddLinkDialog } from "../../components/AddLinkDialog";
import { DeleteLinkDialog } from "../../components/DeleteLinkDialog";
import { CheerSection } from "../../components/CheerSection";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface UserProfilePageProps {
  params: Promise<{
    displayName: string;
  }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = use(params);
  const rawDisplayName = resolvedParams?.displayName
    ? decodeURIComponent(resolvedParams.displayName)
    : "";
  const cleanDisplayName = rawDisplayName.trim().replace(/^@+/, "");

  const { user: currentUser } = useAuth();

  // 1. displayName으로 유저 검색 (Firestore: users 컬렉션 where display_name == cleanDisplayName)
  const {
    data: searchedUser,
    isLoading: isUserLoading,
    isFetched: isUserFetched,
  } = useProfileByDisplayNameQuery(cleanDisplayName);

  // 본인 프로필인지 여부 판별
  const isOwner = Boolean(
    currentUser && searchedUser && currentUser.uid === searchedUser.uid
  );

  // 2. 검색된 유저의 링크 목록 조회: users/(userid)/links
  const targetUserId = searchedUser?.uid;
  const { data: remoteLinks, isLoading: isLinksLoading } = useLinksQuery(targetUserId);

  const addLinkMutation = useAddLinkMutation(targetUserId);
  const updateLinkMutation = useUpdateLinkMutation(targetUserId);
  const deleteLinkMutation = useDeleteLinkMutation(targetUserId);
  const clickLinkMutation = useClickLinkMutation(targetUserId);

  const [showQrModal, setShowQrModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 응원 인터랙션 로컬 상태
  const [cheerCount, setCheerCount] = useState(128);
  const [hasCheered, setHasCheered] = useState(false);
  const [cheers, setCheers] = useState<CheerMessage[]>([
    {
      id: "c1",
      author: "마이링크 팬",
      content: `${cleanDisplayName}님의 링크 모음 응원합니다! ✨`,
      time: "방금 전",
    },
  ]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // 3. username이 없는 경우 (검색 완료 후 null): notFound() 호출
  useEffect(() => {
    if (isUserFetched && !searchedUser) {
      notFound();
    }
  }, [isUserFetched, searchedUser]);

  // 공유하기 핸들러
  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://mylink.app/${encodeURIComponent(cleanDisplayName)}`;
    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${searchedUser?.display_name || cleanDisplayName} | 마이링크`,
          text: `${searchedUser?.display_name || cleanDisplayName}님의 프로필 링크 목록이에요 🐣`,
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
      const handleToCopy = searchedUser?.handle || cleanDisplayName;
      await navigator.clipboard.writeText(`@${handleToCopy}`);
      showToast("아이디가 복사되었어요 📋");
    }
  };

  const handleCheerHeart = () => {
    if (!hasCheered) {
      setCheerCount((prev) => prev + 1);
      setHasCheered(true);
      showToast("따뜻한 응원을 보냈어요 ❤️");
    } else {
      setCheerCount((prev) => Math.max(0, prev - 1));
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
    setCheers((prev) => [newCheer, ...prev]);
    showToast("응원 메시지가 등록되었어요 ✨");
  };

  const handleLinkClick = (clickedLink: LinkItem) => {
    if (targetUserId) {
      clickLinkMutation.mutate(clickedLink.id);
    }
  };

  const handleAddLink = async (newLinkData: Omit<LinkItem, "id" | "click_count">) => {
    if (!isOwner) {
      showToast("본인의 페이지만 링크를 추가할 수 있어요 🔒");
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

  const handleUpdateLink = async (
    linkId: string,
    updatedFields: Partial<Omit<LinkItem, "id">>
  ) => {
    if (!isOwner) {
      showToast("본인의 페이지만 링크를 수정할 수 있어요 🔒");
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

  const handleDeleteLink = async (linkId: string) => {
    if (!isOwner) {
      showToast("본인의 페이지만 링크를 삭제할 수 있어요 🔒");
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
    if (!isOwner) return;
    setDeletingLink(link);
    setShowDeleteModal(true);
  };

  // 로딩 화면
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#3182F6]" />
          <p className="text-[14px] font-medium text-[#4E5968]">
            @{cleanDisplayName} 프로필을 찾는 중이에요...
          </p>
        </div>
      </div>
    );
  }

  // 검색 결과 유저가 없는 경우 404 폴백 UI
  if (isUserFetched && !searchedUser) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center justify-center px-5 py-12">
        <Card className="w-full max-w-[430px] p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0F2] flex items-center justify-center text-[#F04452] mb-5">
            <UserX className="w-8 h-8 stroke-[2.2]" />
          </div>
          <span className="text-[12px] font-bold text-[#F04452] bg-[#FFF0F2] px-2.5 py-1 rounded-full mb-3">
            404 NOT FOUND
          </span>
          <h1 className="text-[20px] font-bold text-[#191F28] mb-2">
            사용자를 찾을 수 없어요
          </h1>
          <p className="text-[14px] text-[#6B7684] mb-6">
            <span className="font-semibold text-[#191F28]">@{cleanDisplayName}</span> 님의 프로필이 존재하지 않아요.
          </p>
          <Link href="/" className="w-full">
            <Button className="w-full h-11 bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold rounded-xl cursor-pointer">
              MyLink 홈으로 가기
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const currentLinks = remoteLinks ?? [];
  const activeLinks = currentLinks
    .filter((l) => l.is_active)
    .sort((a, b) => {
      const timeA = getTimestampNumber(a.createdAt);
      const timeB = getTimestampNumber(b.createdAt);
      if (timeA !== timeB) {
        return timeB - timeA;
      }
      return (a.sort_order ?? 1) - (b.sort_order ?? 1);
    });

  const totalClicks = currentLinks.reduce((acc, curr) => acc + (curr.click_count || 0), 0);

  const profileData: ProfileData = {
    uid: searchedUser?.uid,
    email: searchedUser?.email,
    handle: searchedUser?.handle || cleanDisplayName,
    display_name: searchedUser?.display_name || cleanDisplayName,
    badge: searchedUser?.badge,
    bio: searchedUser?.bio || "안녕하세요! 마이링크에 오신 것을 환영해요 ✨",
    avatar_url: searchedUser?.avatar_url || "/images/avatar.svg",
    socials: searchedUser?.socials,
  };

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

      {/* 1. Header */}
      <Header
        onOpenQr={() => setShowQrModal(true)}
        onShare={handleShare}
        onShowToast={showToast}
        linksCount={activeLinks.length}
        totalClicks={totalClicks}
      />

      {/* Main Container */}
      <main className="w-full max-w-[430px] px-5 py-5 flex flex-col gap-4">
        {/* 본인 페이지 안내 배지 (본인 접속 시) */}
        {isOwner && (
          <div className="bg-[#E8F3FF] border border-[#3182F6]/30 text-[#1B64DA] rounded-xl px-3.5 py-2.5 flex items-center justify-between text-[12px] font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#3182F6]" />
              현재 회원님의 공개 프로필 페이지를 보고 계세요
            </span>
            <Link href="/edit" className="font-bold underline ml-2 shrink-0">
              수정하기
            </Link>
          </div>
        )}

        {/* 2. Profile Hero Section */}
        <ProfileHero
          profile={profileData}
          isOwner={isOwner}
          onCopyHandle={handleCopyHandle}
          onShowToast={showToast}
        />

        {/* 3. Links Container */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1 pt-2 pb-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[17px] font-bold text-[#191F28] tracking-tight">
                {profileData.display_name}의 링크
              </h2>
              <Badge variant="brand" className="text-[11px] px-2 py-0.5 tabular-nums">
                {activeLinks.length}개
              </Badge>
            </div>

            {/* 본인일 때만 새 링크 추가 버튼 표시 */}
            {isOwner && (
              <Button
                onClick={() => setShowAddModal(true)}
                variant="brandWeak"
                size="sm"
                className="h-8 px-2.5 rounded-full text-[12px] font-bold gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>새 링크 추가</span>
              </Button>
            )}
          </div>

          {/* Links List State */}
          {isLinksLoading ? (
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
                  readOnly={!isOwner}
                  onLinkClick={handleLinkClick}
                  onUpdateLink={isOwner ? handleUpdateLink : undefined}
                  onRequestDelete={isOwner ? handleRequestDelete : undefined}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-[#8B95A1] flex flex-col items-center gap-3">
              <p className="text-[14px]">
                {isOwner
                  ? "아직 등록된 링크가 없어요. 첫 링크를 추가해보세요!"
                  : "현재 등록된 공개 링크가 없어요."}
              </p>
              {isOwner && (
                <Button
                  onClick={() => setShowAddModal(true)}
                  variant="default"
                  size="sm"
                  className="rounded-xl font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>첫 링크 추가하기</span>
                </Button>
              )}
            </Card>
          )}
        </section>

        {/* 4. Interactive Section : 응원 남기기 */}
        <CheerSection
          cheerCount={cheerCount}
          cheers={cheers}
          onAddCheer={handleAddCheer}
          onCheerClick={handleCheerHeart}
          hasCheered={hasCheered}
        />

        {/* 5. Viral Footer Banner */}
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

      {/* 6. QR Code Popup Modal */}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        displayName={profileData.display_name}
        handle={profileData.handle}
        url={
          typeof window !== "undefined"
            ? window.location.href
            : `https://mylink.app/${encodeURIComponent(cleanDisplayName)}`
        }
        onCopySuccess={() => showToast("프로필 주소가 복사되었어요 📋")}
      />

      {/* 7. 본인일 때 링크 추가 및 삭제 다이얼로그 */}
      {isOwner && (
        <>
          <AddLinkDialog
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddLink={handleAddLink}
          />
          <DeleteLinkDialog
            isOpen={showDeleteModal}
            link={deletingLink}
            onClose={() => {
              setShowDeleteModal(false);
              setDeletingLink(null);
            }}
            onConfirmDelete={handleDeleteLink}
          />
        </>
      )}
    </div>
  );
}
