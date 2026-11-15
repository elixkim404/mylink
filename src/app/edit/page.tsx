"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Check,
  Sparkles,
  Mail,
  Tag,
  User,
  FileText,
  Lock,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { MyLinkData, ProfileData, UserProfileDoc } from "../../types/mylink";
import {
  getStoredMyLinkData,
  saveStoredMyLinkData,
  DEFAULT_MYLINK_DATA,
} from "../../lib/storage";
import { useAuth } from "../../lib/authContext";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { GoogleIcon } from "../../components/icons/GoogleIcon";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function MyPageEditProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, userProfile, loading: authLoading, signInWithGoogle, updateProfileData } = useAuth();

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [badge, setBadge] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/images/avatar.svg");
  const [github, setGithub] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Firestore userProfile 또는 로컬스토리지에서 프로필 로드
  useEffect(() => {
    queueMicrotask(() => {
      if (user && userProfile) {
        const emailPrefix = (userProfile.email || user.email || "").split("@")[0];
        const initialDisplayName =
          userProfile.display_name && userProfile.display_name !== user.displayName
            ? userProfile.display_name
            : emailPrefix;

        setDisplayName(initialDisplayName || "");
        setHandle(userProfile.handle || emailPrefix || "");
        setBadge(userProfile.badge || "");
        setBio(userProfile.bio || "");
        setAvatarUrl(userProfile.avatar_url || user.photoURL || "/images/avatar.svg");

        setGithub(userProfile.socials?.github || "");
        const rawEmail = userProfile.socials?.email || (user.email ? `mailto:${user.email}` : "");
        setEmail(rawEmail.startsWith("mailto:") ? rawEmail.replace("mailto:", "") : rawEmail);
        setInstagram(userProfile.socials?.instagram || "");
      } else {
        const data: MyLinkData = getStoredMyLinkData();
        const p = data.profile || DEFAULT_MYLINK_DATA.profile;

        setDisplayName(p.display_name || "");
        setHandle(p.handle || "");
        setBadge(p.badge || "");
        setBio(p.bio || "");
        setAvatarUrl(p.avatar_url || "/images/avatar.svg");

        setGithub(p.socials?.github || "");
        const rawEmail = p.socials?.email || "";
        setEmail(rawEmail.startsWith("mailto:") ? rawEmail.replace("mailto:", "") : rawEmail);
        setInstagram(p.socials?.instagram || "");
      }
    });
  }, [user, userProfile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const profile = await signInWithGoogle();
      if (profile) {
        showToast(`${profile.display_name} 님, 마이페이지에 오신 것을 환영해요! 🎉`);
      }
    } catch {
      showToast("구글 로그인 중 오류가 발생했어요 ⚠️");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("이미지 파일만 선택할 수 있어요 ⚠️");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("사진 크기는 5MB 이하로 업로드해주세요 ⚠️");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        showToast("새 사진이 선택되었어요 📷");
      }
    };
    reader.onerror = () => {
      showToast("이미지를 불러오는데 실패했어요 ⚠️");
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleResetAvatar = () => {
    const defaultImg = user?.photoURL || "/images/avatar.svg";
    setAvatarUrl(defaultImg);
    showToast("기본 프로필 사진으로 복원했어요 ✨");
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      showToast("이름을 입력해주세요 ⚠️");
      return;
    }

    const cleanHandle = handle.trim().replace(/^@+/, "");
    if (!cleanHandle) {
      showToast("아이디(핸들)를 입력해주세요 ⚠️");
      return;
    }

    setIsSubmitting(true);

    const cleanEmail = email.trim();
    const formattedEmail = cleanEmail
      ? cleanEmail.startsWith("mailto:")
        ? cleanEmail
        : `mailto:${cleanEmail}`
      : "";

    const updatedProfile: ProfileData = {
      uid: user?.uid,
      email: cleanEmail || user?.email || undefined,
      display_name: trimmedName,
      handle: cleanHandle,
      badge: badge.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl,
      socials: {
        github: github.trim(),
        email: formattedEmail,
        instagram: instagram.trim(),
      },
    };

    try {
      // 1. 로그인된 유저일 경우 Firestore users/(user.uid) 문서 낙관적 업데이트
      if (user) {
        const docPayload: Partial<UserProfileDoc> = {
          display_name: trimmedName,
          handle: cleanHandle,
          badge: badge.trim(),
          bio: bio.trim(),
          avatar_url: avatarUrl,
          socials: {
            github: github.trim(),
            email: formattedEmail,
            instagram: instagram.trim(),
          },
        };
        await updateProfileData(docPayload);
      }

      // 2. 로컬스토리지 백업 동기화 (즉시 반영)
      const storedData = getStoredMyLinkData();
      const nextData: MyLinkData = {
        ...storedData,
        profile: updatedProfile,
      };
      saveStoredMyLinkData(nextData);

      showToast("마이페이지 프로필이 즉시 업데이트되었어요 ✨");

      // 지체 없이 부드럽게 메인 페이지로 복귀
      setTimeout(() => {
        router.push("/");
      }, 350);
    } catch (err) {
      console.error("프로필 저장 실패:", err);
      showToast("프로필 저장 중 오류가 발생하여 이전 상태로 복원했어요 ⚠️");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center pb-28 selection:bg-[#3182F6] selection:text-white">
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

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full max-w-[430px] bg-[#F9FAFB]/90 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-[#E5E8EB]/50">
        <Link
          href="/"
          className="flex items-center gap-1 text-[#4E5968] hover:text-[#191F28] transition-colors p-1"
          aria-label="메인 화면으로 돌아가기"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[14px] font-medium">뒤로</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <h1 className="text-[17px] font-bold text-[#191F28] tracking-tight">
            마이페이지
          </h1>
          <Badge variant="brand" className="text-[10px] px-1.5 py-0">
            프로필
          </Badge>
        </div>

        <Button
          onClick={() => handleSave()}
          variant="brandWeak"
          size="sm"
          className="h-8 px-3 rounded-full text-[13px] font-bold cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "저장"
          )}
        </Button>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-[430px] px-5 py-5 flex flex-col gap-4">
        {/* 비로그인 상태일 때: 마이페이지 설명 및 로그인 유도 배너 */}
        {!authLoading && !user && (
          <Card className="p-5 text-left border-[#3182F6]/30 bg-blue-50/40">
            <div className="flex items-center gap-2 mb-2 text-[#3182F6]">
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <h2 className="text-[15px] font-bold">마이페이지 이용 안내</h2>
            </div>
            <p className="text-[13px] text-[#4E5968] leading-relaxed mb-3.5">
              마이페이지에서 프로필과 링크를 영구 저장하고 수정하려면 로그인이 필요해요.
              Google 소셜 계정으로 로그인하시면 나만의 <code className="text-[11px] bg-white px-1 py-0.5 rounded text-[#3182F6] font-mono">users/(user.uid)</code>에 안전하게 동기화됩니다.
            </p>
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              variant="default"
              size="sm"
              className="w-full bg-[#191F28] hover:bg-[#333D4B] text-white rounded-xl font-bold gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <GoogleIcon className="w-3.5 h-3.5" />
              )}
              <span>Google 계정으로 로그인하기</span>
            </Button>
          </Card>
        )}

        {/* 로그인 사용자 확인 카드 */}
        {user && (
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] text-[#8B95A1] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3182F6]" />
              Firestore <code className="text-[11px] font-mono text-[#3182F6]">users/{user.uid}</code> 연동 중
            </span>
            <span className="text-[11px] text-[#8B95A1] truncate max-w-[170px]">
              {user.email}
            </span>
          </div>
        )}

        {/* 1. Profile Avatar Section */}
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="relative mb-3 group">
            <Avatar className="w-[96px] h-[96px] border-2 border-[#E5E8EB] shadow-xs bg-[#F9FAFB]">
              <AvatarImage
                src={avatarUrl || "/images/avatar.svg"}
                alt={displayName || "아바타"}
                className="w-full h-full object-cover"
              />
              <AvatarFallback>{(displayName || "마이").slice(0, 2)}</AvatarFallback>
            </Avatar>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
              title="사진 변경"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">사진 변경</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#3182F6] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-[#1B64DA] transition-all cursor-pointer"
              title="사진 선택"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-2 mt-1">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="rounded-xl text-[12px] font-semibold gap-1.5 h-8 px-3"
            >
              <Camera className="w-3.5 h-3.5 text-[#3182F6]" />
              <span>사진 변경하기</span>
            </Button>

            {avatarUrl !== "/images/avatar.svg" && (
              <Button
                type="button"
                onClick={handleResetAvatar}
                variant="ghost"
                size="sm"
                className="rounded-xl text-[12px] font-medium text-[#8B95A1] hover:text-[#4E5968] gap-1 h-8 px-2.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>기본 이미지로</span>
              </Button>
            )}
          </div>
          <p className="text-[11px] text-[#8B95A1] mt-2">
            권장 규격: 1:1 비율의 JPG, PNG (5MB 이하)
          </p>
        </Card>

        {/* 2. Basic Information Form */}
        <Card className="p-5 flex flex-col gap-4 text-left">
          <div className="flex items-center gap-1.5 pb-1 border-b border-[#E5E8EB]/60">
            <User className="w-4 h-4 text-[#3182F6]" />
            <h2 className="text-[15px] font-bold text-[#191F28]">기본 정보</h2>
          </div>

          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1">
              <span>이름 (닉네임)</span>
              <span className="text-[#F04452]">*</span>
            </label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="예: 김예현"
              maxLength={30}
              className="h-11 px-3.5 text-[14px] font-medium bg-white"
            />
          </div>

          {/* Handle (@username) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1">
              <span>아이디 (핸들)</span>
              <span className="text-[#F04452]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#8B95A1] font-bold text-[15px] select-none">
                @
              </span>
              <Input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@+/, ""))}
                placeholder="junseop_dev"
                maxLength={30}
                className="h-11 pl-8 pr-3.5 text-[14px] font-medium bg-white"
              />
            </div>
            <p className="text-[11px] text-[#8B95A1]">
              공개 프로필 URL 주소로 사용돼요 (예: @{handle || "username"})
            </p>
          </div>

          {/* Badge / Status Tag */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#8B95A1]" />
              <span>프로필 뱃지</span>
            </label>
            <Input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="예: 🎓 컴공과 26학번 또는 Google 연동"
              maxLength={40}
              className="h-11 px-3.5 text-[14px] font-medium bg-white"
            />
            <p className="text-[11px] text-[#8B95A1]">
              이름 옆에 파란색 라벨로 표시되는 소속이나 상태 태그예요
            </p>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#8B95A1]" />
              <span>한 줄 소개 (소개글)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
              placeholder="자신을 자유롭게 소개해 보세요"
              className="w-full rounded-xl border border-[#E5E8EB] bg-white p-3 text-[13px] text-[#191F28] leading-relaxed shadow-2xs transition-colors placeholder:text-[#B0B8C1] focus:outline-hidden focus:border-[#3182F6] resize-none"
            />
            <div className="flex justify-end">
              <span className="text-[11px] text-[#8B95A1] tabular-nums">
                {bio.length} / 160자
              </span>
            </div>
          </div>
        </Card>

        {/* 3. Socials & Contact Form */}
        <Card className="p-5 flex flex-col gap-4 text-left">
          <div className="flex items-center gap-1.5 pb-1 border-b border-[#E5E8EB]/60">
            <Sparkles className="w-4 h-4 text-[#3182F6]" />
            <h2 className="text-[15px] font-bold text-[#191F28]">소셜 & 연락처 링크</h2>
          </div>

          {/* GitHub */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1.5">
              <GithubIcon className="w-3.5 h-3.5 text-[#191F28]" />
              <span>GitHub 주소</span>
            </label>
            <Input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username"
              className="h-11 px-3.5 text-[13px] bg-white"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#3182F6]" />
              <span>이메일 주소</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@example.com"
              className="h-11 px-3.5 text-[13px] bg-white"
            />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-[#F04452]" />
              <span>인스타그램 주소</span>
            </label>
            <Input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/username"
              className="h-11 px-3.5 text-[13px] bg-white"
            />
          </div>
        </Card>
      </main>

      {/* Floating Bottom Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
        <div className="w-full h-8 bg-linear-to-t from-[#F9FAFB] to-transparent pointer-events-none" />
        <div className="w-full max-w-[430px] px-5 pb-5 bg-[#F9FAFB] pointer-events-auto flex items-center gap-2">
          <Button
            type="button"
            onClick={() => handleSave()}
            variant="default"
            size="xl"
            disabled={isSubmitting}
            className="w-full shadow-md font-bold cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5 stroke-[2.5]" />
            )}
            <span>수정 완료하기</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
