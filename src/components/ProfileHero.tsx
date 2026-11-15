"use client";

import React from "react";
import Link from "next/link";
import { Mail, Copy, Pencil } from "lucide-react";
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

interface ProfileHeroProps {
  profile: ProfileData;
  onCopyHandle: () => void;
  onShowToast: (msg: string) => void;
}

export function ProfileHero({ profile, onCopyHandle }: ProfileHeroProps) {
  return (
    <Card className="p-6 flex flex-col items-center text-center relative overflow-hidden">
      {/* 1. Avatar (88px x 88px) with subtle link to /edit */}
      <div className="relative mb-3.5 group">
        <Link href="/edit" title="프로필 수정하러 가기" className="block cursor-pointer">
          <Avatar className="w-[88px] h-[88px] border-2 border-[#E5E8EB] shadow-xs bg-[#F9FAFB] transition-transform group-hover:scale-105">
            <AvatarImage
              src={profile.avatar_url || "/images/avatar.svg"}
              alt={profile.display_name}
              className="w-full h-full object-cover"
            />
            <AvatarFallback>{profile.display_name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#3182F6] text-white rounded-full flex items-center justify-center shadow-xs border-2 border-white group-hover:scale-110 transition-transform">
            <Pencil className="w-3 h-3 stroke-[2.5]" />
          </div>
        </Link>
      </div>

      {/* 2. Name & Badge Row */}
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

      {/* 3. Handle Copy Button */}
      <button
        onClick={onCopyHandle}
        className="inline-flex items-center gap-1 text-[13px] font-medium text-[#8B95A1] hover:text-[#3182F6] transition-colors mb-3 cursor-pointer group outline-hidden"
        title="클릭하여 아이디 복사"
      >
        <span>@{profile.handle}</span>
        <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
      </button>

      {/* 4. Bio text (2~3 lines) */}
      <p className="text-[14px] text-[#4E5968] leading-relaxed max-w-sm whitespace-pre-line mb-4">
        {profile.bio}
      </p>

      {/* 5. Social Quick Links Bar */}
      <div className="flex items-center justify-center gap-2.5 w-full mb-3.5">
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

      {/* 6. Profile Edit CTA Button (Links to /edit) */}
      <Link href="/edit" className="w-full" title="마이페이지로 이동">
        <Button
          variant="secondary"
          size="sm"
          className="w-full rounded-xl text-[12px] font-semibold text-[#4E5968] hover:text-[#191F28] gap-1.5 h-8.5 cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5 text-[#8B95A1]" />
          <span>마이페이지에서 수정하기</span>
        </Button>
      </Link>
    </Card>
  );
}
