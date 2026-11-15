"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  Check,
  Plus,
  Loader2,
  Sparkles,
  ArrowRight,
  UserX,
} from "lucide-react";
import { LinkItem, CheerMessage, ProfileData, UserProfileDoc } from "../types/mylink";
import { getStoredMyLinkData } from "../lib/storage";
import { getTimestampNumber } from "../lib/firebaseLinks";
import {
  useLinksQuery,
  useAddLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
  useClickLinkMutation,
} from "../lib/useLinks";
import { useProfileQuery, useProfileByDisplayNameQuery } from "../lib/useProfile";
import { useAuth } from "../lib/authContext";
import { Header } from "./Header";
import { ProfileHero } from "./ProfileHero";
import { LinkCard } from "./LinkCard";
import { QRCodeModal } from "./QRCodeModal";
import { AddLinkDialog } from "./AddLinkDialog";
import { DeleteLinkDialog } from "./DeleteLinkDialog";
import { CheerSection } from "./CheerSection";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getUserProfileFullUrl } from "../lib/urls";

interface UserProfileViewProps {
  userId: string;
}

export function UserProfileView({ userId }: UserProfileViewProps) {
  const rawUserId = userId ? decodeURIComponent(userId) : "";
  const cleanUserId = rawUserId.trim().replace(/^@+/, "");

  const { user: currentUser, userProfile: currentUserProfile, loading: authLoading } = useAuth();

  // 1. userId(UID)로 Firestore users/{userId} 직접 조회
  const {
    data: directUser,
    isLoading: isDirectLoading,
    isFetched: isDirectFetched,
  } = useProfileQuery(cleanUserId);

  // 2. 만약 UID로 조회되지 않을 경우 displayName/handle fallback 조회
  const shouldFallback = isDirectFetched && !directUser && Boolean(cleanUserId);
  const {
    data: fallbackUser,
    isLoading: isFallbackLoading,
  } = useProfileByDisplayNameQuery(shouldFallback ? cleanUserId : undefined);

  // 3. 로그인한 본인 계정 또는 로컬스토리지 프로필과의 일치 여부 확인
  const selfOrLocalUser: UserProfileDoc | null = React.useMemo(() => {
    if (!cleanUserId) return null;

    if (currentUser) {
      const emailPrefix = (currentUserProfile?.email || currentUser.email || "").split("@")[0];
      const isSelfMatch =
        cleanUserId === "me" ||
        cleanUserId === currentUser.uid ||
        cleanUserId === currentUserProfile?.uid ||
        cleanUserId === currentUserProfile?.handle ||
        cleanUserId === currentUserProfile?.display_name ||
        (emailPrefix && cleanUserId === emailPrefix);

      if (isSelfMatch) {
        return {
          uid: currentUser.uid,
          email: currentUserProfile?.email || currentUser.email || "",
          display_name:
            currentUserProfile?.display_name ||
            emailPrefix ||
            currentUser.displayName ||
            "마이링크 회원",
          handle: currentUserProfile?.handle || emailPrefix || currentUser.uid.slice(0, 8),
          badge: currentUserProfile?.badge || "Google 연동",
          bio:
            currentUserProfile?.bio ||
            "안녕하세요! 나만의 링크를 모아둔 마이링크 프로필이에요 ✨",
          avatar_url:
            currentUserProfile?.avatar_url || currentUser.photoURL || "/images/avatar.svg",
          socials: currentUserProfile?.socials || {
            email: currentUser.email ? `mailto:${currentUser.email}` : undefined,
          },
        };
      }
    }

    if (typeof window !== "undefined") {
      const stored = getStoredMyLinkData();
      const p = stored?.profile;
      if (
        p &&
        (cleanUserId === p.uid ||
          cleanUserId === p.handle ||
          cleanUserId === p.display_name)
      ) {
        return {
          uid: p.uid || cleanUserId,
          email: p.email || "",
          display_name: p.display_name || cleanUserId,
          handle: p.handle || cleanUserId,
          badge: p.badge,
          bio: p.bio,
          avatar_url: p.avatar_url || "/images/avatar.svg",
          socials: p.socials,
        };
      }
    }

    return null;
  }, [cleanUserId, currentUser, currentUserProfile]);

  const searchedUser = directUser || fallbackUser || selfOrLocalUser;
  const isUserLoading =
    !searchedUser && (authLoading || isDirectLoading || (shouldFallback && isFallbackLoading));

  // 본인 프로필인지 여부 판별
  const isOwner = Boolean(
    currentUser &&
      (currentUser.uid === cleanUserId ||
        cleanUserId === "me" ||
        (searchedUser && currentUser.uid === searchedUser.uid))
  );

  // 4. 해당 유저의 링크 목록 조회: users/{targetUserId}/links
  const targetUserId = searchedUser?.uid || cleanUserId;
  const { data: remoteLinks, isLoading: isLinksLoading } = useLinksQuery(
    searchedUser ? targetUserId : undefined
  );

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
      content: `${searchedUser?.display_name || cleanUserId}님의 링크 모음 응원합니다! ✨`,
      time: "방금 전",
    },
  ]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // 공유하기 핸들러 (user id 기반의 서비스 전체 URL 사용)
  const handleShare = async () => {
    const shareUrl = getUserProfileFullUrl(targetUserId);
    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${searchedUser?.display_name || "프로필"} | 마이링크`,
          text: `${searchedUser?.display_name || "사용자"}님의 프로필 링크 목록이에요 🐣`,
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
      const handleToCopy = searchedUser?.handle || cleanUserId;
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

  // 링크 클릭 시 카운트 증가
  const handleLinkClick = (clickedLink: LinkItem) => {
    clickLinkMutation.mutate(clickedLink.id);
  };

  // 링크 추가 (본인 전용)
  const handleAddLink = async (newLinkData: Omit<LinkItem, "id" | "click_count">) => {
    if (!isOwner) return;
    try {
      await addLinkMutation.mutateAsync(newLinkData);
      showToast("새 링크가 성공적으로 추가되었어요 ✨");
    } catch (error) {
      console.error("링크 추가 실패:", error);
      showToast("링크 추가 중 오류가 발생했어요 ⚠️");
    }
  };

  // 링크 수정 (본인 전용)
  const handleUpdateLink = async (
    linkId: string,
    updatedFields: Partial<Omit<LinkItem, "id">>
  ) => {
    if (!isOwner) return;
    try {
      await updateLinkMutation.mutateAsync({ linkId, updatedFields });
      showToast("링크가 성공적으로 수정되었어요 ✨");
    } catch (error) {
      console.error("링크 수정 실패:", error);
      showToast("링크 수정 중 오류가 발생했어요 ⚠️");
    }
  };

  // 링크 삭제 (본인 전용)
  const handleDeleteLink = async (linkId: string) => {
    if (!isOwner) return;
    try {
      await deleteLinkMutation.mutateAsync(linkId);
      showToast("링크가 삭제되었어요 🗑️");
    } catch (error) {
      console.error("링크 삭제 실패:", error);
      showToast("링크 삭제 중 오류가 발생했어요 ⚠️");
    }
  };

  // 활성 링크 목록 및 정렬
  const linksList: LinkItem[] = remoteLinks || [];
  const activeLinks = linksList
    .filter((l) => l.is_active)
    .sort((a, b) => {
      const timeA = getTimestampNumber(a.createdAt);
      const timeB = getTimestampNumber(b.createdAt);
      if (timeA !== timeB) return timeB - timeA;
      return (a.sort_order ?? 1) - (b.sort_order ?? 1);
    });

  const totalClicks = linksList.reduce((acc, curr) => acc + (curr.click_count || 0), 0);

  // 로딩 상태 화면
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-5">
        <Loader2 className="w-8 h-8 animate-spin text-[#3182F6] mb-3" />
        <p className="text-[14px] font-semibold text-[#4E5968]">
          @{cleanUserId} 님의 프로필을 불러오는 중이에요...
        </p>
      </div>
    );
  }

  // 사용자 미발견 화면
  if (!searchedUser) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-5 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#F04452] flex items-center justify-center mb-4">
          <UserX className="w-8 h-8" />
        </div>
        <h1 className="text-[20px] font-bold text-[#191F28] mb-1.5">
          존재하지 않는 사용자예요
        </h1>
        <p className="text-[14px] text-[#6B7684] max-w-[280px] mb-6">
          <code className="text-[#3182F6] font-mono">@{cleanUserId}</code> 주소의 프로필을 찾을 수 없어요.
        </p>
        <Link href="/">
          <Button variant="default" size="default" className="rounded-xl">
            MyLink 홈으로 이동하기
          </Button>
        </Link>
      </div>
    );
  }

  // 프로필 카드 데이터 변환
  const profileData: ProfileData = {
    uid: searchedUser.uid,
    email: searchedUser.email,
    handle: searchedUser.handle || cleanUserId,
    display_name: searchedUser.display_name || cleanUserId,
    badge: searchedUser.badge || (isOwner ? "내 프로필" : "MyLink"),
    bio: searchedUser.bio || "환영합니다! 저의 링크를 모아둔 공간이에요 ✨",
    avatar_url: searchedUser.avatar_url || "/images/avatar.svg",
    socials: searchedUser.socials,
  };

  const fullShareUrl = getUserProfileFullUrl(targetUserId);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center pb-24 selection:bg-[#3182F6] selection:text-white">
      {/* Toast Notification */}
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

      {/* 1. Header with Share, QR, and Auth */}
      <Header
        onOpenQr={() => setShowQrModal(true)}
        onShare={handleShare}
        onShowToast={showToast}
        linksCount={activeLinks.length}
        totalClicks={totalClicks}
      />

      {/* Main Container */}
      <main className="w-full max-w-[430px] px-5 py-5 flex flex-col gap-4">
        {/* 본인이 아닐 때 방문자 안내 배너 */}
        {!isOwner && (
          <div className="bg-blue-50/70 border border-[#3182F6]/20 rounded-2xl px-4 py-2.5 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#3182F6] font-semibold">
                👤 {searchedUser.display_name} 님의 공개 프로필 공간
              </span>
            </div>
            <Link
              href="/"
              className="text-[11px] font-bold text-[#3182F6] hover:underline"
            >
              내 링크 만들기 &gt;
            </Link>
          </div>
        )}

        {/* 2. Profile Hero Section */}
        <ProfileHero
          profile={profileData}
          onCopyHandle={handleCopyHandle}
          onShowToast={showToast}
          isOwner={isOwner}
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

            {/* 본인일 때만 [+ 새 링크 추가] 버튼 노출 */}
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

          {/* 링크 목록 */}
          {isLinksLoading ? (
            <Card className="p-8 text-center text-[#8B95A1] flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#3182F6]" />
              <p className="text-[13px] font-medium text-[#4E5968]">
                링크를 불러오는 중이에요...
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
                  onRequestDelete={
                    isOwner
                      ? (targetLink) => {
                          setDeletingLink(targetLink);
                          setShowDeleteModal(true);
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border-dashed border-[#E5E8EB] bg-[#F9FAFB]/50">
              <p className="text-[14px] text-[#4E5968] font-medium mb-1">
                등록된 링크가 아직 없어요
              </p>
              <p className="text-[12px] text-[#8B95A1]">
                {isOwner
                  ? "상단의 '+ 새 링크 추가' 버튼을 눌러 링크를 등록해보세요."
                  : "다음에 다시 방문해 주세요!"}
              </p>
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

      {/* 6. QR Code Popup Modal (user id 기반 URL 적용) */}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        displayName={profileData.display_name}
        handle={profileData.handle}
        url={fullShareUrl}
        onCopySuccess={() => showToast("프로필 주소가 복사되었어요 📋")}
      />

      {/* 7. 링크 추가/삭제 다이얼로그 (본인 전용) */}
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
