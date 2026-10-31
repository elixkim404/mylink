"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Share2,
  ExternalLink,
  Heart,
  Sparkles,
  Code2,
  Check,
  GraduationCap,
  FolderGit2,
  BadgeCheck,
  QrCode,
  MapPin,
  Coffee,
  Sun,
  Moon,
  Laptop,
  Layers,
  ArrowUpRight,
  Terminal,
  Send,
  Play,
  Pause,
  Volume2,
  Eye,
  X,
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

interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  isExternal?: boolean;
  highlight?: boolean;
}

const LINKS: LinkItem[] = [
  {
    id: "github",
    title: "GitHub 프로필",
    description: "진행 중인 토이 프로젝트와 오픈소스 기여 내역",
    url: "https://github.com/elixkim404",
    icon: GithubIcon,
    badge: "Active",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    isExternal: true,
  },
  {
    id: "mylink",
    title: "마이링크 (MyLink) 레포지토리",
    description: "Next.js 16 & Tailwind 기반 링크트리 서비스",
    url: "https://github.com/elixkim404/mylink",
    icon: FolderGit2,
    badge: "Featured",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    isExternal: true,
    highlight: true,
  },
  {
    id: "vibecoding",
    title: "바이브코딩 학습 기록",
    description: "AI 페어 프로그래밍과 실전 빌드 아카이빙",
    url: "https://github.com/elixkim404",
    icon: Code2,
    badge: "Study",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    isExternal: true,
  },
  {
    id: "contact",
    title: "이메일 문의 & 커피챗",
    description: "아이디어 교류나 협업 제안은 언제든 환영합니다",
    url: "mailto:294705559+elixkim404@users.noreply.github.com",
    icon: Mail,
    badge: "Coffee Chat",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    isExternal: false,
  },
];

const TECH_STACK = [
  { name: "Next.js 16", category: "Framework", color: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" },
  { name: "React 19", category: "Library", color: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-400/30" },
  { name: "TypeScript", category: "Language", color: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-400/30" },
  { name: "Tailwind CSS", category: "Styling", color: "bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-400/30" },
  { name: "Vibe Coding", category: "Philosophy", color: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-400/30" },
  { name: "AI Pair Coding", category: "Tool", color: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-400/30" },
];

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  time: string;
  emoji: string;
}

const DEFAULT_MESSAGES: GuestMessage[] = [
  {
    id: "1",
    name: "익명의 러너",
    message: "바이브코딩으로 만든 마이링크 페이지 디자인 깔끔하고 멋져요! ✨",
    time: "방금 전",
    emoji: "🔥",
  },
  {
    id: "2",
    name: "동료 빌더",
    message: "앞으로의 프로젝트들도 기대하고 응원하겠습니다 ☕",
    time: "1시간 전",
    emoji: "🚀",
  },
];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState<{ id: number; left: number }[]>([]);
  const [activeTab, setActiveTab] = useState<"links" | "about">("links");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  // Guestbook state
  const [messages, setMessages] = useState<GuestMessage[]>(DEFAULT_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [guestName, setGuestName] = useState("");

  // Dark mode hook
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const saved = localStorage.getItem("theme");
      const isDark = saved ? saved === "dark" : mediaQuery.matches;
      document.documentElement.classList.toggle("dark", isDark);
      setIsDarkMode(isDark);
    };

    const timer = setTimeout(applyTheme, 0);
    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        if (navigator.share) {
          await navigator.share({
            title: "김예현 (elixkim404) | MyLink",
            text: "바이브코딩으로 아이디어를 현실로 만드는 대학생 개발자 김예현의 프로필",
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      }
    } catch {
      // User cancelled or unsupported
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      // Spawn flying heart particles
      const newHeart = { id: Date.now(), left: Math.random() * 40 - 20 };
      setFlyingHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setFlyingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1200);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleAddCheer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const emojis = ["✨", "🔥", "🚀", "☕", "👏", "💖", "🎉"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const entry: GuestMessage = {
      id: Date.now().toString(),
      name: guestName.trim() || "익명의 응원자",
      message: newMessage.trim(),
      time: "방금 전",
      emoji: randomEmoji,
    };

    setMessages([entry, ...messages]);
    setNewMessage("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-between px-4 py-8 md:py-14 selection:bg-indigo-500 selection:text-white">
      {/* Ambient Animated Blurred Orbs Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] [background-image:radial-gradient(#000_1px,transparent_1px)] dark:[background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Floating gradient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-500/25 to-purple-500/20 blur-3xl animate-float-slow" />
        <div className="absolute top-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-bl from-pink-500/20 to-sky-500/20 blur-3xl animate-float-reverse" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-gradient-to-t from-violet-500/15 to-amber-500/15 blur-3xl animate-float-slow" />
      </div>

      {/* Top utility bar */}
      <header className="w-full max-w-xl flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50 backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
            <span className="w-2 h-2 rounded-full bg-indigo-500 absolute inline-block" />
            <span className="ml-1">MyLink v1.0</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* QR Code trigger */}
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 rounded-full glass-card hover:scale-105 active:scale-95 transition-all text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer shadow-xs"
            title="QR 코드로 열기"
            aria-label="QR 코드 보기"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full glass-card hover:scale-105 active:scale-95 transition-all text-zinc-600 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 cursor-pointer shadow-xs"
            title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            aria-label="테마 전환"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full glass-card hover:border-indigo-400/60 dark:hover:border-indigo-500/60 hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-xs"
            title="프로필 링크 복사 및 공유"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">복사됨!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                <span className="text-zinc-700 dark:text-zinc-200">공유</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Profile Container */}
      <main className="w-full max-w-xl flex flex-col items-center text-center">
        {/* Profile Card Box */}
        <section className="w-full p-6 sm:p-8 rounded-3xl glass-card shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.35)] relative overflow-hidden transition-all duration-300">
          {/* Subtle gradient banner line at top of card */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* Avatar with Glow and Pulse Ring */}
          <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 mb-5 group">
            {/* Ambient glow behind avatar */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300" />

            <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3.5px] shadow-xl transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-900 dark:to-zinc-950 flex flex-col items-center justify-center overflow-hidden border border-white/40 dark:border-zinc-800">
                <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent select-none tracking-tight">
                  예현
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 -mt-0.5 tracking-wider uppercase">
                  Builder
                </span>
              </div>
            </div>

            {/* Status Indicator Badge */}
            <div
              className="absolute bottom-1 right-1 inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-md"
              title="현재 바이브코딩 탐구 및 빌딩 중"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Vibe Coding</span>
            </div>
          </div>

          {/* Name & Verified Badge */}
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              김예현
            </h1>
            <span title="공식 인증 프로필">
              <BadgeCheck className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
            </span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400/40" />
          </div>

          {/* Handle */}
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
            <span>@elixkim404</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Seoul, KR
            </span>
          </div>

          {/* Bio statement */}
          <p className="mt-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed max-w-md mx-auto">
            바이브코딩으로 아이디어를 현실로 구현하는 대학생 빌더입니다. <br className="hidden sm:inline" />
            AI와 페어 프로그래밍하며 유용한 서비스를 만들고 배웁니다.
          </p>

          {/* Identity Tag Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 font-medium">
              <GraduationCap className="w-3.5 h-3.5" />
              대학생 개발자
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              바이브코딩
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40 font-medium">
              <Coffee className="w-3.5 h-3.5" />
              커피챗 환영
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 font-medium">
              <Laptop className="w-3.5 h-3.5" />
              Web & AI
            </span>
          </div>

          {/* Action & Stats Row */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/80">
            {/* GitHub button */}
            <a
              href="https://github.com/elixkim404"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all shadow-xs"
              aria-label="GitHub 프로필 방문"
              title="GitHub 바로가기"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {/* Email button */}
            <a
              href="mailto:294705559+elixkim404@users.noreply.github.com"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all shadow-xs"
              aria-label="이메일 문의"
              title="이메일 보내기"
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* Like cheer button with flying heart animation */}
            <div className="relative">
              <button
                onClick={handleLike}
                className={`h-10 px-4 rounded-full border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                  hasLiked
                    ? "bg-rose-500 text-white border-rose-500 shadow-rose-500/25 scale-105"
                    : "glass-card text-zinc-700 dark:text-zinc-200 hover:border-rose-300 dark:hover:border-rose-800"
                }`}
                title="프로필 응원하기 (클릭해 보세요!)"
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    hasLiked ? "fill-white text-white scale-110" : "text-rose-500"
                  }`}
                />
                <span>응원 {likes}</span>
              </button>

              {/* Floating Hearts */}
              {flyingHearts.map((h) => (
                <div
                  key={h.id}
                  style={{ left: `calc(50% + ${h.left}px)` }}
                  className="pointer-events-none absolute -top-4 -translate-x-1/2 text-rose-500 animate-fly-heart z-30"
                >
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
              ))}
            </div>

            {/* Visitor counter preview */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full glass-card text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>Today 148</span>
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="w-full mt-6 p-1 rounded-2xl glass-card flex items-center justify-center gap-1 shadow-xs">
          <button
            onClick={() => setActiveTab("links")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "links"
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>주요 링크 & 프로젝트</span>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "about"
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>소개 & 기술 스택</span>
          </button>
        </div>

        {/* TAB 1: LINKS & PROJECTS */}
        {activeTab === "links" && (
          <div className="w-full mt-5 flex flex-col gap-3.5 transition-all">
            {/* Featured Highlight Card */}
            <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-lg shadow-indigo-600/20 text-left relative overflow-hidden group">
              {/* Background ambient shine */}
              <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-white/10 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 uppercase tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Featured Project
                </span>
                <span className="text-[11px] text-indigo-200 font-mono">Next.js 16 + Tailwind</span>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                마이링크 (MyLink)
              </h2>
              <p className="text-xs text-indigo-100/90 mt-1 leading-relaxed">
                바이브코딩으로 직접 설계하고 개발한 나만의 고감도 링크인바이오(Link-in-bio) 서비스입니다.
              </p>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/15">
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Turbopack & TypeScript</span>
                </div>
                <a
                  href="https://github.com/elixkim404/mylink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-indigo-900 font-semibold text-xs hover:bg-indigo-50 transition-all shadow-sm group-hover:translate-x-0.5"
                >
                  <span>코드 보기</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Link List */}
            {LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className="group relative flex items-center justify-between p-4 rounded-2xl glass-card hover:border-indigo-400/80 dark:hover:border-indigo-500/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 text-left min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:scale-108 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {link.title}
                        </h3>
                        {link.badge && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              link.badgeColor || "bg-indigo-50 text-indigo-600 border-indigo-200"
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all group-hover:translate-x-1 shrink-0 pl-2">
                    {link.isExternal ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* TAB 2: ABOUT & TECH BENTO */}
        {activeTab === "about" && (
          <div className="w-full mt-5 flex flex-col gap-4 text-left transition-all">
            {/* Tech Stack Bento Card */}
            <div className="p-6 rounded-2xl glass-card shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">관심 기술 스택 & 개발 환경</h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                현대적인 웹 프론트엔드와 최신 AI 코딩 어시스턴트를 접목하여 신속한 프로토타이핑을 즐깁니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech.name}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-transform hover:scale-105 select-none ${tech.color}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Now Playing Lo-Fi Vibe Widget */}
            <div className="p-5 rounded-2xl glass-card flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-pink-500/20">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                      Coding Soundtrack
                    </span>
                    {isPlayingMusic && (
                      <span className="flex items-end gap-[2px] h-3 ml-1">
                        <span className="w-[3px] bg-pink-500 rounded-full animate-wave-1" />
                        <span className="w-[3px] bg-indigo-500 rounded-full animate-wave-2" />
                        <span className="w-[3px] bg-purple-500 rounded-full animate-wave-3" />
                        <span className="w-[3px] bg-pink-400 rounded-full animate-wave-4" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                    Lofi Chill Beats · Deep Focus
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    바이브코딩 집중 모드 세션
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 transition-transform active:scale-90 cursor-pointer shrink-0 ml-2"
                title={isPlayingMusic ? "일시정지" : "재생"}
              >
                {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>

            {/* Mini Guestbook / Cheer Note Box */}
            <div className="p-6 rounded-2xl glass-card shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">한 줄 응원 남기기</h3>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {messages.length}개의 응원
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleAddCheer} className="mt-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="이름 (생략 가능)"
                    className="w-1/3 px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 focus:outline-hidden focus:border-indigo-500 text-zinc-900 dark:text-zinc-100"
                    maxLength={15}
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="응원의 한마디를 남겨보세요!"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 focus:outline-hidden focus:border-indigo-500 text-zinc-900 dark:text-zinc-100"
                    maxLength={80}
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pre-filled cheer tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {["🔥 멋진 사이트네요!", "☕ 커피 한잔 응원!", "🚀 바이브코딩 최고!"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewMessage(preset)}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </form>

              {/* Message Feed */}
              <div className="mt-4 flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/50 flex items-start gap-2.5 text-xs"
                  >
                    <span className="text-base select-none">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {item.name}
                        </strong>
                        <span className="text-[10px] text-zinc-400">{item.time}</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-300 mt-0.5 leading-snug break-words">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs p-6 rounded-3xl glass-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
              모바일로 공유하기
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              카메라로 QR 코드를 스캔하여 바로 접속하세요.
            </p>

            {/* QR Pattern visual box */}
            <div className="p-4 bg-white rounded-2xl border border-zinc-200 inline-block shadow-inner mb-4">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                {/* Corner 1 */}
                <rect x="10" y="10" width="25" height="25" rx="3" fill="#0f172a" />
                <rect x="15" y="15" width="15" height="15" rx="1.5" fill="white" />
                <rect x="18" y="18" width="9" height="9" rx="1" fill="#4f46e5" />

                {/* Corner 2 */}
                <rect x="65" y="10" width="25" height="25" rx="3" fill="#0f172a" />
                <rect x="70" y="15" width="15" height="15" rx="1.5" fill="white" />
                <rect x="73" y="18" width="9" height="9" rx="1" fill="#4f46e5" />

                {/* Corner 3 */}
                <rect x="10" y="65" width="25" height="25" rx="3" fill="#0f172a" />
                <rect x="15" y="70" width="15" height="15" rx="1.5" fill="white" />
                <rect x="18" y="73" width="9" height="9" rx="1" fill="#4f46e5" />

                {/* Data blocks */}
                <rect x="42" y="14" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="14" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="24" width="6" height="6" fill="#4f46e5" />
                <rect x="52" y="24" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="34" width="16" height="6" fill="#0f172a" />
                <rect x="14" y="42" width="6" height="16" fill="#0f172a" />
                <rect x="24" y="42" width="6" height="8" fill="#4f46e5" />
                <rect x="70" y="42" width="16" height="6" fill="#0f172a" />
                <rect x="70" y="52" width="8" height="6" fill="#4f46e5" />
                <rect x="82" y="52" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="52" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="52" width="6" height="16" fill="#4f46e5" />
                <rect x="42" y="70" width="8" height="8" fill="#0f172a" />
                <rect x="70" y="70" width="8" height="8" fill="#0f172a" />
                <rect x="80" y="80" width="8" height="8" fill="#4f46e5" />
                <rect x="62" y="80" width="6" height="8" fill="#0f172a" />
              </svg>
            </div>

            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "링크 복사 완료!" : "링크 복사하기"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-xl text-center mt-12 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          Powered by <strong className="font-semibold text-zinc-800 dark:text-zinc-200">MyLink</strong> · © 2026 김예현
        </p>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>& Vibe</span>
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            맨 위로 ↑
          </button>
        </div>
      </footer>
    </div>
  );
}
