"use client";

import { useState } from "react";
import {
  Share2,
  QrCode,
  ChevronRight,
  Copy,
  Coffee,
  Heart,
  GraduationCap,
  Send,
  Check,
  Laptop,
  BookOpen,
  MessageCircle,
} from "lucide-react";

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
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

// CUTE VECTOR CHARACTER AVATARS (사진의 턱 괴고 있는 시그니처 포즈 & 디테일 반영)
function CuteCharacterAvatar({ type }: { type: "student" | "cat" | "chick" }) {
  if (type === "cat") {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
        <circle cx="60" cy="60" r="58" fill="#FFF2F5" />
        <polygon points="32,25 45,50 22,46" fill="#FFAAA6" />
        <polygon points="30,30 40,48 24,45" fill="#FF8E88" />
        <polygon points="88,25 75,50 98,46" fill="#FFAAA6" />
        <polygon points="90,30 80,48 96,45" fill="#FF8E88" />
        <ellipse cx="60" cy="64" rx="38" ry="32" fill="#FFFFFF" />
        <circle cx="36" cy="68" r="7" fill="#FFD1D8" opacity="0.8" />
        <circle cx="84" cy="68" r="7" fill="#FFD1D8" opacity="0.8" />
        <ellipse cx="45" cy="62" rx="4.5" ry="5.5" fill="#191F28" />
        <circle cx="47" cy="60" r="2" fill="#FFFFFF" />
        <ellipse cx="75" cy="62" rx="4.5" ry="5.5" fill="#191F28" />
        <circle cx="77" cy="60" r="2" fill="#FFFFFF" />
        <polygon points="58,68 62,68 60,71" fill="#FF8E88" />
        <path d="M55,73 Q60,77 65,73" stroke="#191F28" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="64" x2="32" y2="66" stroke="#D1D6DB" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="72" x2="32" y2="70" stroke="#D1D6DB" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="64" x2="88" y2="66" stroke="#D1D6DB" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="72" x2="88" y2="70" stroke="#D1D6DB" strokeWidth="2" strokeLinecap="round" />
        <path d="M26,58 C26,34 94,34 94,58" stroke="#3182F6" strokeWidth="6" strokeLinecap="round" />
        <rect x="22" y="52" width="8" height="16" rx="4" fill="#3182F6" />
        <rect x="90" y="52" width="8" height="16" rx="4" fill="#3182F6" />
        <path d="M60,32 Q62,22 68,24 Q68,28 62,32" fill="#2B9D5B" />
      </svg>
    );
  }

  if (type === "chick") {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
        <circle cx="60" cy="60" r="58" fill="#FFF9E6" />
        <circle cx="60" cy="65" r="36" fill="#FFDC60" />
        <circle cx="38" cy="70" r="6" fill="#FFA5A5" opacity="0.8" />
        <circle cx="82" cy="70" r="6" fill="#FFA5A5" opacity="0.8" />
        <circle cx="46" cy="62" r="4.5" fill="#191F28" />
        <circle cx="48" cy="60" r="1.5" fill="#FFFFFF" />
        <circle cx="74" cy="62" r="4.5" fill="#191F28" />
        <circle cx="76" cy="60" r="1.5" fill="#FFFFFF" />
        <ellipse cx="60" cy="68" rx="6" ry="4" fill="#FF8A00" />
        <path d="M60,30 C55,20 65,16 66,24 C66,27 62,29 60,30 Z" fill="#2B9D5B" />
        <circle cx="46" cy="62" r="12" stroke="#3182F6" strokeWidth="3" fill="none" />
        <circle cx="74" cy="62" r="12" stroke="#3182F6" strokeWidth="3" fill="none" />
        <line x1="58" y1="62" x2="62" y2="62" stroke="#3182F6" strokeWidth="3" />
      </svg>
    );
  }

  // CUSTOM YEHYUN CHARACTER (실제 사진의 긴 흑발 5:5 가르마 + 턱 괴기 포즈 + 스프링 머리끈 팔찌 반영된 캐릭터 아바타)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/avatar.svg"
      alt="김예현 캐릭터 아바타"
      className="w-full h-full object-cover"
    />
  );
}

interface LinkRowItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  url: string;
  iconBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

const LINKS: LinkRowItem[] = [
  {
    id: "github",
    title: "깃허브 저장소",
    subtitle: "1학년 동안 차근차근 쌓아갈 과제와 토이 프로젝트예요",
    badge: "Active",
    url: "https://github.com/elixkim404",
    iconBg: "bg-[#F2F4F6]",
    iconColor: "text-[#191F28]",
    icon: GithubIcon,
    isExternal: true,
  },
  {
    id: "mylink",
    title: "마이링크 (MyLink)",
    subtitle: "새내기의 첫 웹 프로젝트, 토스 디자인 시스템(TDS)으로 만든 링크트리",
    badge: "Featured",
    url: "https://github.com/elixkim404/mylink",
    iconBg: "bg-[#E8F3FF]",
    iconColor: "text-[#3182F6]",
    icon: Laptop,
    isExternal: true,
  },
  {
    id: "study",
    title: "새내기 개발 & 공부 일지",
    subtitle: "C언어, 파이썬, 웹 기초 수업과 스터디 내용을 기록해요",
    badge: "Study",
    url: "https://github.com/elixkim404",
    iconBg: "bg-[#E8F3FF]",
    iconColor: "text-[#3182F6]",
    icon: BookOpen,
    isExternal: true,
  },
  {
    id: "coffee",
    title: "커피챗 & 선배님 조언 신청",
    subtitle: "선배님들의 꿀팁이나 동기들과의 스터디 이야기, 언제든 환영해요!",
    badge: "Coffee Chat",
    url: "mailto:294705559+elixkim404@users.noreply.github.com",
    iconBg: "bg-[#FFF4E5]",
    iconColor: "text-[#FF8A00]",
    icon: Coffee,
    isExternal: false,
  },
];

interface CheerMessage {
  id: string;
  author: string;
  content: string;
  time: string;
}

const DEFAULT_CHEERS: CheerMessage[] = [
  {
    id: "1",
    author: "컴공과 선배",
    content: "예현아 1학년 때부터 이렇게 깃허브랑 웹 만들어두는 거 훌륭하다! 파이팅 🍀",
    time: "20분 전",
  },
  {
    id: "2",
    author: "새내기 동기",
    content: "캐릭터 너무 귀엽고 예현이랑 완전 똑닮았어! 우리 다음 주 과제 같이 하자 ☕",
    time: "1시간 전",
  },
];

export default function Home() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cheerCount, setCheerCount] = useState(168);
  const [hasCheered, setHasCheered] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Avatar mode: "student" (예현 맞춤 캐릭터) or "cat" or "chick"
  const [avatarMode, setAvatarMode] = useState<"student" | "cat" | "chick">("student");

  // Cheer notes state
  const [cheers, setCheers] = useState<CheerMessage[]>(DEFAULT_CHEERS);
  const [authorInput, setAuthorInput] = useState("");
  const [contentInput, setContentInput] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        if (navigator.share) {
          await navigator.share({
            title: "김예현의 마이링크",
            text: "컴퓨터공학과 1학년 새내기 김예현의 프로필이에요 🐣",
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          showToast("링크가 클립보드에 복사되었어요");
        }
      }
    } catch {
      // User cancelled
    }
  };

  const handleCopyHandle = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText("@elixkim404");
      showToast("아이디가 복사되었어요");
    }
  };

  const handleCheerHeart = () => {
    if (!hasCheered) {
      setCheerCount((prev) => prev + 1);
      setHasCheered(true);
      showToast("예현이에게 새내기 응원을 보냈어요 ❤️");
    } else {
      setCheerCount((prev) => prev - 1);
      setHasCheered(false);
    }
  };

  const handleAddCheer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentInput.trim()) return;

    const newEntry: CheerMessage = {
      id: Date.now().toString(),
      author: authorInput.trim() || "익명의 학우",
      content: contentInput.trim(),
      time: "방금 전",
    };

    setCheers([newEntry, ...cheers]);
    setContentInput("");
    showToast("응원 메시지가 등록되었어요 ✨");
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] flex flex-col items-center pb-28">
      {/* TDS TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-[#191F28] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-[14px] font-medium">
            <span className="w-4 h-4 rounded-full bg-[#2B9D5B] flex items-center justify-center text-white shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION BAR (56px) */}
      <header className="sticky top-0 z-30 w-full max-w-lg bg-[#F2F4F6]/90 backdrop-blur-md px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[18px] text-[#191F28] tracking-tight">
            마이링크
          </span>
          <span className="text-[12px] font-semibold text-[#3182F6] bg-[#E8F3FF] px-2 py-0.5 rounded-full">
            예현 🐣
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#E5E8EB] flex items-center justify-center text-[#4E5968] transition-colors cursor-pointer shadow-xs"
            title="QR 코드 보기"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#E5E8EB] flex items-center justify-center text-[#4E5968] transition-colors cursor-pointer shadow-xs"
            title="프로필 공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER (Single Column Mobile-First, max-w-lg) */}
      <main className="w-full max-w-lg px-4 pt-2 flex flex-col gap-3">
        {/* CARD 1: PROFILE HERO CARD */}
        <section className="tds-card p-6 flex flex-col items-start relative overflow-hidden">
          {/* Avatar and Style Switcher */}
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-3">
              {/* Profile Avatar Circle (사진 속 얼굴과 특징을 본뜬 캐릭터) */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white shrink-0 hover:scale-105 transition-transform relative">
                <CuteCharacterAvatar type={avatarMode} />
              </div>

              {/* Mode Switcher Buttons */}
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[11px] font-medium text-[#8B95A1]">프로필 캐릭터 선택</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => {
                      setAvatarMode("student");
                      showToast("예현 맞춤 캐릭터로 바꿨어요 👩‍💻");
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      avatarMode === "student"
                        ? "bg-[#3182F6] text-white"
                        : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                    }`}
                  >
                    예현 캐릭터 👩‍💻
                  </button>
                  <button
                    onClick={() => {
                      setAvatarMode("cat");
                      showToast("코딩냥이로 바꿨어요 🐱");
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      avatarMode === "cat"
                        ? "bg-[#3182F6] text-white"
                        : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                    }`}
                  >
                    코딩냥 🐱
                  </button>
                  <button
                    onClick={() => {
                      setAvatarMode("chick");
                      showToast("새내기 병아리로 바꿨어요 🐣");
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      avatarMode === "chick"
                        ? "bg-[#3182F6] text-white"
                        : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                    }`}
                  >
                    새내기 병아리 🐣
                  </button>
                </div>
              </div>
            </div>

            {/* Heart Cheer Pill */}
            <button
              onClick={handleCheerHeart}
              className={`h-9 px-3.5 rounded-full flex items-center gap-1.5 text-[13px] font-semibold transition-all cursor-pointer shrink-0 ${
                hasCheered
                  ? "bg-[#FFF0F2] text-[#F04452]"
                  : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  hasCheered ? "fill-[#F04452] text-[#F04452] scale-110" : "text-[#4E5968]"
                }`}
              />
              <span className="tabular-nums">{cheerCount}</span>
            </button>
          </div>

          {/* Name & Handle */}
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[24px] font-bold text-[#191F28] tracking-tight">
              김예현
            </h1>
            <span className="w-5 h-5 rounded-full bg-[#3182F6] flex items-center justify-center text-white" title="인증된 프로필">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="text-[12px] font-bold text-[#2B9D5B] bg-[#E8F8F0] px-2 py-0.5 rounded-full">
              새내기 1학년
            </span>
          </div>

          <button
            onClick={handleCopyHandle}
            className="flex items-center gap-1 text-[14px] font-medium text-[#8B95A1] hover:text-[#3182F6] transition-colors mb-3.5 cursor-pointer"
          >
            <span>@elixkim404</span>
            <Copy className="w-3 h-3" />
          </button>

          {/* Fresh 1st-Year CS Major Bio (해요체) */}
          <p className="text-[15px] text-[#4E5968] leading-relaxed mb-4 text-left">
            안녕하세요! 코딩이 마냥 신기하고 재밌는 컴퓨터공학과 1학년 새내기 예현이에요 🐣 <br />
            기초 프로그래밍부터 차근차근 시작해서, 사람들에게 유용한 웹 서비스를 직접 만들어보는 멋진 개발자가 되는 게 꿈이에요 🫧
          </p>

          {/* Freshman Tag Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#3182F6] bg-[#E8F3FF] px-2.5 py-1 rounded-full">
              <GraduationCap className="w-3.5 h-3.5" />
              컴공과 1학년 새내기
            </span>
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2B9D5B] bg-[#E8F8F0] px-2.5 py-1 rounded-full">
              🌱 프론트엔드 새싹
            </span>
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#4E5968] bg-[#F2F4F6] px-2.5 py-1 rounded-full">
              선배님 &amp; 동기 커피챗 환영 ☕
            </span>
          </div>
        </section>

        {/* CARD 2: OFFICIAL LINKS LIST (TDS ListRow pattern) */}
        <section className="tds-card overflow-hidden">
          <div className="px-5 pt-5 pb-2 text-left">
            <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight">
              예현의 활동 &amp; 저장소
            </h2>
            <p className="text-[13px] text-[#8B95A1] mt-0.5">
              관심 있는 항목을 누르면 바로 둘러보실 수 있어요
            </p>
          </div>

          <div className="divide-y divide-[#E5E8EB]">
            {LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className="tds-pressable flex items-center justify-between px-5 py-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 text-left">
                    <div
                      className={`w-11 h-11 rounded-[14px] ${link.iconBg} ${link.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-[16px] font-semibold text-[#191F28] truncate group-hover:text-[#3182F6] transition-colors">
                          {link.title}
                        </h3>
                        {link.badge && (
                          <span className="text-[11px] font-semibold text-[#3182F6] bg-[#E8F3FF] px-1.5 py-0.2 rounded-[4px]">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#8B95A1] truncate mt-0.5">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#B0B8C1] group-hover:text-[#3182F6] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </a>
              );
            })}
          </div>
        </section>

        {/* CARD 3: FRESHMAN DAILY & STUDY SNAPSHOTS (올려주신 사진 적용!) */}
        <section className="tds-card p-5 text-left">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight">
                새내기 코딩 일상
              </h2>
              <p className="text-[13px] text-[#8B95A1] mt-0.5">
                도서관과 강의실에서 열심히 공부하는 일상이에요
              </p>
            </div>
            <span className="text-[12px] font-medium text-[#2B9D5B] bg-[#E8F8F0] px-2 py-0.5 rounded-full">
              Campus 🌿
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Campus workspace photo */}
            <div className="rounded-[16px] overflow-hidden bg-[#F2F4F6] aspect-4/3 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/workspace.jpg"
                alt="캠퍼스 코딩 공간"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 bg-[#191F28]/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                캠퍼스 코딩 공간 💻
              </div>
            </div>

            <div className="rounded-[16px] overflow-hidden bg-[#F2F4F6] aspect-4/3 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/coding.jpg"
                alt="도서관 코딩 세션"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 bg-[#191F28]/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                도서관 코딩 ☕
              </div>
            </div>
          </div>
        </section>

        {/* CARD 4: CHEER GUESTBOOK */}
        <section className="tds-card p-5 text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#3182F6]" />
              <h2 className="text-[18px] font-bold text-[#191F28] tracking-tight">
                예현이에게 새내기 응원 남기기
              </h2>
            </div>
            <span className="text-[12px] text-[#8B95A1] tabular-nums">
              {cheers.length}개의 응원
            </span>
          </div>

          <form onSubmit={handleAddCheer} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                placeholder="이름"
                className="w-24 px-3 h-11 bg-[#F2F4F6] rounded-[12px] border border-[#E5E8EB] text-[14px] text-[#191F28] placeholder-[#B0B8C1] focus:outline-hidden focus:border-[#3182F6] focus:bg-white transition-all"
                maxLength={10}
              />
              <input
                type="text"
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                placeholder="새내기에게 따뜻한 한마디를 남겨보세요"
                className="flex-1 px-3.5 h-11 bg-[#F2F4F6] rounded-[12px] border border-[#E5E8EB] text-[14px] text-[#191F28] placeholder-[#B0B8C1] focus:outline-hidden focus:border-[#3182F6] focus:bg-white transition-all"
                maxLength={60}
              />
              <button
                type="submit"
                className="w-11 h-11 rounded-[12px] bg-[#3182F6] hover:bg-[#1B64DA] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="응원 등록하기"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Messages list */}
          <div className="mt-4 flex flex-col gap-2 max-h-48 overflow-y-auto">
            {cheers.map((item) => (
              <div
                key={item.id}
                className="bg-[#F9FAFB] p-3 rounded-[14px] border border-[#E5E8EB] flex flex-col text-left"
              >
                <div className="flex items-center justify-between text-[12px] text-[#8B95A1] mb-1">
                  <span className="font-semibold text-[#333D4B]">{item.author}</span>
                  <span className="tabular-nums">{item.time}</span>
                </div>
                <p className="text-[14px] text-[#4E5968] leading-snug">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-6 text-[13px] text-[#8B95A1] leading-relaxed">
          <p>© 2026 김예현 · 컴퓨터공학과 1학년</p>
          <p className="text-[12px] text-[#B0B8C1] mt-0.5">
            토스 디자인 시스템(TDS) 가이드로 정성껏 만들었어요
          </p>
        </footer>
      </main>

      {/* TDS QR CODE BOTTOM SHEET / MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-t-[24px] sm:rounded-[24px] p-6 text-center shadow-xl animate-in slide-in-from-bottom-5 duration-200">
            {/* Sheet Handle for mobile */}
            <div className="w-10 h-1 bg-[#E5E8EB] rounded-full mx-auto mb-4 sm:hidden" />

            <h3 className="text-[18px] font-bold text-[#191F28] mb-1">
              모바일로 프로필 열기
            </h3>
            <p className="text-[14px] text-[#8B95A1] mb-5">
              스마트폰 카메라로 QR 코드를 비추면 바로 열려요
            </p>

            {/* QR Pattern */}
            <div className="p-3 bg-[#F9FAFB] rounded-[20px] border border-[#E5E8EB] inline-block mb-5">
              <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" rx="12" />
                <rect x="12" y="12" width="22" height="22" rx="4" fill="#191F28" />
                <rect x="16" y="16" width="14" height="14" rx="2" fill="white" />
                <rect x="19" y="19" width="8" height="8" rx="1.5" fill="#3182F6" />

                <rect x="66" y="12" width="22" height="22" rx="4" fill="#191F28" />
                <rect x="70" y="16" width="14" height="14" rx="2" fill="white" />
                <rect x="73" y="19" width="8" height="8" rx="1.5" fill="#3182F6" />

                <rect x="12" y="66" width="22" height="22" rx="4" fill="#191F28" />
                <rect x="16" y="70" width="14" height="14" rx="2" fill="white" />
                <rect x="19" y="73" width="8" height="8" rx="1.5" fill="#3182F6" />

                <rect x="42" y="16" width="6" height="6" rx="1" fill="#191F28" />
                <rect x="52" y="16" width="6" height="6" rx="1" fill="#191F28" />
                <rect x="42" y="26" width="6" height="6" rx="1" fill="#3182F6" />
                <rect x="52" y="26" width="6" height="6" rx="1" fill="#191F28" />
                <rect x="42" y="36" width="16" height="6" rx="1" fill="#191F28" />
                <rect x="16" y="44" width="6" height="16" rx="1" fill="#191F28" />
                <rect x="26" y="44" width="6" height="8" rx="1" fill="#3182F6" />
                <rect x="70" y="44" width="14" height="6" rx="1" fill="#191F28" />
                <rect x="70" y="54" width="8" height="6" rx="1" fill="#3182F6" />
                <rect x="80" y="54" width="6" height="6" rx="1" fill="#191F28" />
                <rect x="42" y="54" width="6" height="6" rx="1" fill="#191F28" />
                <rect x="52" y="54" width="6" height="14" rx="1" fill="#3182F6" />
                <rect x="42" y="72" width="8" height="8" rx="1" fill="#191F28" />
                <rect x="70" y="72" width="8" height="8" rx="1" fill="#191F28" />
                <rect x="80" y="82" width="8" height="8" rx="1" fill="#3182F6" />
                <rect x="62" y="82" width="6" height="8" rx="1" fill="#191F28" />
              </svg>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleShare}
                className="w-full h-12 rounded-[14px] bg-[#3182F6] hover:bg-[#1B64DA] text-white text-[15px] font-semibold transition-colors cursor-pointer"
              >
                링크 복사하기
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full h-12 rounded-[14px] bg-[#F2F4F6] text-[#4E5968] text-[15px] font-medium transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TDS FIXED BOTTOM CTA BAR (Height 56px with Scrim Protection) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
        {/* Protection Scrim Gradient */}
        <div className="w-full h-8 tds-cta-scrim" />

        {/* Bottom CTA Button Container */}
        <div className="w-full max-w-lg px-4 pb-4 bg-[#F2F4F6] pointer-events-auto">
          <a
            href="mailto:294705559+elixkim404@users.noreply.github.com"
            className="tds-btn-primary w-full h-14 rounded-[16px] font-bold text-[17px] flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Coffee className="w-5 h-5" />
            <span>예현이와 커피챗 &amp; 이야기 나누기</span>
          </a>
        </div>
      </div>
    </div>
  );
}
