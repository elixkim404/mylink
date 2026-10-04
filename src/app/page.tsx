"use client";

import { useState } from "react";
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
  isExternal?: boolean;
}

const LINKS: LinkItem[] = [
  {
    id: "github",
    title: "GitHub 프로필",
    description: "진행 중인 프로젝트와 오픈소스 기여 내역",
    url: "https://github.com/elixkim404",
    icon: GithubIcon,
    badge: "Active",
    isExternal: true,
  },
  {
    id: "mylink",
    title: "마이링크 (MyLink) 레포지토리",
    description: "Next.js & TypeScript 기반 링크트리 서비스",
    url: "https://github.com/elixkim404/mylink",
    icon: FolderGit2,
    badge: "New",
    isExternal: true,
  },
  {
    id: "vibecoding",
    title: "바이브코딩 학습 기록",
    description: "AI 페어 프로그래밍과 실전 프로젝트 빌드",
    url: "https://github.com/elixkim404",
    icon: Code2,
    badge: "Learning",
    isExternal: true,
  },
  {
    id: "contact",
    title: "이메일 문의 & 커피챗",
    description: "궁금한 점이나 협업 제안은 언제든 환영합니다",
    url: "mailto:294705559+elixkim404@users.noreply.github.com",
    icon: Mail,
    isExternal: false,
  },
];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-zinc-800 dark:text-zinc-100 flex flex-col items-center justify-between px-4 py-12 md:py-16 selection:bg-indigo-500 selection:text-white">
      {/* Top action buttons */}
      <div className="w-full max-w-lg flex justify-end gap-2 mb-4">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur border border-zinc-200 dark:border-zinc-700 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer"
          title="프로필 링크 복사"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">복사 완료!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>공유하기</span>
            </>
          )}
        </button>
      </div>

      {/* Main Profile Container */}
      <main className="w-full max-w-lg flex flex-col items-center text-center">
        {/* Avatar with gradient border */}
        <div className="relative mb-5 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-tr from-indigo-600 to-purple-600 bg-clip-text text-transparent select-none">
                예현
              </span>
            </div>
          </div>
          {/* Status badge */}
          <div
            className="absolute bottom-1 right-1 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm"
            title="현재 바이브코딩 탐구 중"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Vibe
          </div>
        </div>

        {/* Name and Handle */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          김예현
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400/30" />
        </h1>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
          @elixkim404
        </p>

        {/* Bio */}
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-md leading-relaxed">
          안녕하세요, 저는 바이브코딩을 배우는 대학생입니다.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/40">
            <GraduationCap className="w-3.5 h-3.5" />
            대학생
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            바이브코딩
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            Next.js 16
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            TypeScript
          </span>
        </div>

        {/* Quick Social Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <a
            href="https://github.com/elixkim404"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 hover:scale-105 transition-all shadow-xs"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="mailto:294705559+elixkim404@users.noreply.github.com"
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 hover:scale-105 transition-all shadow-xs"
            aria-label="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <button
            onClick={handleLike}
            className={`h-10 px-3.5 rounded-full border flex items-center gap-1.5 text-xs font-medium transition-all shadow-xs cursor-pointer ${
              hasLiked
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 scale-105"
                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
            }`}
            title="프로필 응원하기"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                hasLiked ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
            <span>{likes}</span>
          </button>
        </div>

        {/* Links Section */}
        <section className="w-full mt-8 flex flex-col gap-3.5" aria-label="링크 목록">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 text-left min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {link.title}
                      </h2>
                      {link.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {link.description}
                    </p>
                  </div>
                </div>

                <div className="text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 shrink-0 pl-2">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg text-center mt-12 pt-6 border-t border-zinc-200/70 dark:border-zinc-800/80">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Powered by <strong className="font-semibold text-zinc-800 dark:text-zinc-200">MyLink</strong> · © 2026 김예현
        </p>
      </footer>
    </div>
  );
}
