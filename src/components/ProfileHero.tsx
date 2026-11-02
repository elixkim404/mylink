"use client";

import React, { useState } from "react";
import { Mail, Copy } from "lucide-react";
import { ProfileData } from "../types/mylink";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

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

  return (
    <AvatarImage
      src="/images/avatar.svg"
      alt="프로필 아바타"
      className="w-full h-full object-cover"
    />
  );
}

interface ProfileHeroProps {
  profile: ProfileData;
  onCopyHandle: () => void;
  onShowToast: (msg: string) => void;
}

export function ProfileHero({ profile, onCopyHandle, onShowToast }: ProfileHeroProps) {
  const [avatarMode, setAvatarMode] = useState<"student" | "cat" | "chick">("student");

  return (
    <Card className="p-6 flex flex-col items-center text-center relative overflow-hidden">
      {/* Avatar Container using shadcn Avatar (88px x 88px) */}
      <div className="relative mb-3.5 group">
        <Avatar className="w-[88px] h-[88px] border-2 border-[#E5E8EB] shadow-xs bg-[#F9FAFB] transition-transform hover:scale-105">
          <CuteCharacterAvatar type={avatarMode} />
          <AvatarFallback>{profile.display_name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Avatar Switcher Chips using shadcn Button variants */}
      <div className="flex items-center gap-1 mb-4 bg-[#F2F4F6] p-1 rounded-full">
        <Button
          variant={avatarMode === "student" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setAvatarMode("student");
            onShowToast("새내기 캐릭터로 변경했어요 👩‍💻");
          }}
          className={`h-7 px-2.5 rounded-full text-[11px] font-semibold ${
            avatarMode === "student" ? "bg-white text-[#3182F6] hover:bg-white shadow-xs" : ""
          }`}
        >
          예현 👩‍💻
        </Button>
        <Button
          variant={avatarMode === "cat" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setAvatarMode("cat");
            onShowToast("코딩냥으로 변경했어요 🐱");
          }}
          className={`h-7 px-2.5 rounded-full text-[11px] font-semibold ${
            avatarMode === "cat" ? "bg-white text-[#3182F6] hover:bg-white shadow-xs" : ""
          }`}
        >
          코딩냥 🐱
        </Button>
        <Button
          variant={avatarMode === "chick" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setAvatarMode("chick");
            onShowToast("병아리로 변경했어요 🐣");
          }}
          className={`h-7 px-2.5 rounded-full text-[11px] font-semibold ${
            avatarMode === "chick" ? "bg-white text-[#3182F6] hover:bg-white shadow-xs" : ""
          }`}
        >
          병아리 🐣
        </Button>
      </div>

      {/* Name & Badge Row using shadcn Badge */}
      <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
        <h1 className="text-[22px] font-bold text-[#191F28] tracking-tight">
          {profile.display_name}
        </h1>
        {profile.badge && (
          <Badge variant="brand" className="text-[12px] px-2.5 py-0.5">
            {profile.badge}
          </Badge>
        )}
      </div>

      {/* Handle Copy Button */}
      <button
        onClick={onCopyHandle}
        className="inline-flex items-center gap-1 text-[13px] font-medium text-[#8B95A1] hover:text-[#3182F6] transition-colors mb-3 cursor-pointer group outline-hidden"
      >
        <span>@{profile.handle}</span>
        <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
      </button>

      {/* Bio text (2~3 lines) */}
      <p className="text-[14px] text-[#4E5968] leading-relaxed max-w-sm whitespace-pre-line mb-5">
        {profile.bio}
      </p>

      {/* Social Quick Links Bar */}
      <div className="flex items-center justify-center gap-2.5 w-full">
        {profile.socials?.github && (
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-95 text-[#333D4B] text-[13px] font-medium transition-all"
            title="GitHub 방문"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        )}

        {profile.socials?.email && (
          <a
            href={profile.socials.email}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-95 text-[#333D4B] text-[13px] font-medium transition-all"
            title="이메일 보내기"
          >
            <Mail className="w-4 h-4 text-[#3182F6]" />
            <span>Mail</span>
          </a>
        )}

        {profile.socials?.instagram && (
          <a
            href={profile.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-95 text-[#333D4B] text-[13px] font-medium transition-all"
            title="인스타그램 방문"
          >
            <InstagramIcon className="w-4 h-4 text-[#F04452]" />
            <span>Insta</span>
          </a>
        )}
      </div>
    </Card>
  );
}
