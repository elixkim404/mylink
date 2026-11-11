"use client";

import React, { useState } from "react";
import { Plus, Sparkles, Globe, Smile, Tag, ChevronRight, X } from "lucide-react";
import { LinkItem } from "../types/mylink";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (linkData: Omit<LinkItem, "id" | "click_count">) => void;
}

const PRESET_EMOJIS = ["🔗", "💻", "📝", "📚", "🐙", "☕", "🎨", "🚀", "💼", "🎬", "🌟", "💡"];
const PRESET_BADGES = ["Featured", "Portfolio", "Blog", "Study", "Active", "New"];

// PRD SC-U02 스마트 OGP 메타데이터 감지 모킹 함수 (Phase 0 로컬 전용)
function detectUrlMetadata(url: string) {
  const cleanUrl = url.trim().toLowerCase();
  if (!cleanUrl) return null;

  if (cleanUrl.includes("github.com")) {
    const rawParts = url.trim().split("github.com/")[1]?.split("/") || [];
    const repo = rawParts[1] ? `GitHub - ${rawParts[1]}` : rawParts[0] ? `GitHub (@${rawParts[0]})` : "GitHub 프로필";
    return {
      title: repo,
      icon: "🐙",
      badge: "Repo",
      subtitle: "오픈소스 기여와 프로젝트 코드 모음",
    };
  }
  if (cleanUrl.includes("velog.io")) {
    const rawParts = url.trim().split("velog.io/@")[1]?.split("/")[0] || "";
    return {
      title: rawParts ? `${rawParts}의 기술 블로그` : "기술 블로그 (Velog)",
      icon: "📚",
      badge: "Blog",
      subtitle: "개발 트러블슈팅과 학습 기록",
    };
  }
  if (cleanUrl.includes("tistory.com")) {
    return {
      title: "기술 블로그 (Tistory)",
      icon: "📚",
      badge: "Blog",
      subtitle: "새로운 기술 학습 및 일지 모음",
    };
  }
  if (cleanUrl.includes("notion.so") || cleanUrl.includes("notion.site")) {
    return {
      title: "노션 포트폴리오 & 이력서",
      icon: "📝",
      badge: "Portfolio",
      subtitle: "프로젝트 상세 회고와 사용 기술 스택",
    };
  }
  if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
    return {
      title: "공식 유튜브 채널",
      icon: "🎬",
      badge: "YouTube",
      subtitle: "영상 콘텐츠와 브이로그 보러가기",
    };
  }
  if (cleanUrl.includes("instagram.com")) {
    const handle = url.trim().split("instagram.com/")[1]?.split("/")[0]?.replace("@", "") || "";
    return {
      title: handle ? `@${handle} 인스타그램` : "공식 인스타그램",
      icon: "📷",
      badge: "Instagram",
      subtitle: "일상 사진과 최신 소식",
    };
  }
  if (cleanUrl.includes("linkedin.com")) {
    return {
      title: "링크드인 프로필",
      icon: "💼",
      badge: "Contact",
      subtitle: "경력 요약과 커리어 네트워크",
    };
  }
  if (cleanUrl.includes("figma.com")) {
    return {
      title: "피그마 디자인 작업물",
      icon: "🎨",
      badge: "Design",
      subtitle: "UI/UX 디자인 시스템 및 프로토타입",
    };
  }

  // 기본 일반 도메인 처리
  try {
    const parsed = new URL(cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`);
    const host = parsed.hostname.replace(/^www\./, "");
    return {
      title: `${host} 바로가기`,
      icon: "🔗",
      badge: "Link",
      subtitle: `${host} 공식 페이지`,
    };
  } catch {
    return null;
  }
}

export function AddLinkDialog({ isOpen, onClose, onAddLink }: AddLinkDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [icon, setIcon] = useState("🔗");
  const [badge, setBadge] = useState("");
  const [isSmartFilled, setIsSmartFilled] = useState(false);
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setSubtitle("");
    setIcon("🔗");
    setBadge("");
    setIsSmartFilled(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (errors.url) {
      setErrors((prev) => ({ ...prev, url: undefined }));
    }

    // 스마트 OGP 메타데이터 자동 감지 (SC-U02)
    const detected = detectUrlMetadata(newUrl);
    if (detected) {
      setIsSmartFilled(true);
      // 제목이 비어있거나 이전에 스마트 채움된 상태면 자동 갱신
      setTitle((prev) => (!prev || isSmartFilled ? detected.title : prev));
      setSubtitle((prev) => (!prev || isSmartFilled ? detected.subtitle : prev));
      setIcon((prev) => (prev === "🔗" || isSmartFilled ? detected.icon : prev));
      setBadge((prev) => (!prev || isSmartFilled ? detected.badge : prev));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();

    const newErrors: { url?: string; title?: string } = {};

    if (!trimmedUrl) {
      newErrors.url = "링크 URL을 입력해주세요.";
    } else {
      // URL 형식 검사
      const isValidFormat =
        trimmedUrl.startsWith("http://") ||
        trimmedUrl.startsWith("https://") ||
        trimmedUrl.startsWith("mailto:") ||
        trimmedUrl.includes(".");
      if (!isValidFormat) {
        newErrors.url = "올바른 URL 형식(예: https://example.com)을 입력해주세요.";
      }
    }

    if (!trimmedTitle) {
      newErrors.title = "링크 제목을 입력해주세요.";
    } else if (trimmedTitle.length > 60) {
      newErrors.title = "제목은 최대 60자까지 입력 가능해요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // URL 프로토콜 보정
    let finalUrl = trimmedUrl;
    if (
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://") &&
      !finalUrl.startsWith("mailto:")
    ) {
      finalUrl = `https://${finalUrl}`;
    }

    onAddLink({
      url: finalUrl,
      title: trimmedTitle,
      subtitle: subtitle.trim() || undefined,
      icon: icon || "🔗",
      badge: badge.trim() || undefined,
      is_active: true,
      sort_order: 1, // 최상단에 배치
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-[430px] max-h-[90vh] overflow-y-auto text-left p-5 sm:p-6"
        onClose={handleClose}
      >
        <DialogHeader className="text-left mb-4">
          <div className="flex items-center gap-1.5 text-[#3182F6] text-[13px] font-semibold mb-1">
            <Plus className="w-4 h-4" />
            <span>Phase 0 · 링크 등록</span>
          </div>
          <DialogTitle className="text-[20px] text-left">새 링크 추가하기</DialogTitle>
          <DialogDescription className="text-left text-[13px]">
            채널이나 포트폴리오를 추가하고 프로필에 실시간으로 노출하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. URL Input Field with Smart OGP Hint */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="link-url" className="text-[13px] font-bold text-[#191F28] flex items-center gap-1">
                <span>URL 주소</span>
                <span className="text-[#F04452]">*</span>
              </label>
              {isSmartFilled && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3182F6] bg-[#E8F3FF] px-2 py-0.5 rounded-full animate-in fade-in duration-200">
                  <Sparkles className="w-3 h-3" />
                  스마트 메타 감지됨
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="link-url"
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://notion.so/... 또는 https://github.com/..."
                className={`pl-9 text-[13px] ${
                  errors.url ? "border-[#F04452] focus-visible:border-[#F04452]" : ""
                }`}
                autoFocus
              />
              <Globe className="w-4 h-4 text-[#8B95A1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {url && (
                <button
                  type="button"
                  onClick={() => {
                    setUrl("");
                    setIsSmartFilled(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B95A1] hover:text-[#191F28] p-0.5 rounded-full cursor-pointer"
                  aria-label="URL 지우기"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {errors.url ? (
              <p className="text-[12px] text-[#F04452] font-medium mt-0.5">{errors.url}</p>
            ) : (
              <p className="text-[11px] text-[#8B95A1]">
                GitHub, Notion, Velog 등 입력 시 제목과 아이콘이 자동 추천돼요.
              </p>
            )}
          </div>

          {/* 2. Title Input Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="link-title" className="text-[13px] font-bold text-[#191F28] flex items-center gap-1">
                <span>링크 제목</span>
                <span className="text-[#F04452]">*</span>
              </label>
              <span className="text-[11px] text-[#8B95A1] tabular-nums">
                {title.length}/60
              </span>
            </div>
            <Input
              id="link-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value.slice(0, 60));
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="예: 나만의 개발 포트폴리오"
              className={`text-[13px] ${
                errors.title ? "border-[#F04452] focus-visible:border-[#F04452]" : ""
              }`}
            />
            {errors.title && (
              <p className="text-[12px] text-[#F04452] font-medium mt-0.5">{errors.title}</p>
            )}
          </div>

          {/* 3. Subtitle / Description Input Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="link-subtitle" className="text-[13px] font-bold text-[#191F28]">
              상세 설명 <span className="text-[#8B95A1] font-normal text-[12px]">(선택)</span>
            </label>
            <Input
              id="link-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value.slice(0, 100))}
              placeholder="예: 프로젝트 상세 회고와 기술 스택 모음집"
              className="text-[13px]"
            />
          </div>

          {/* 4. Icon Selector (Emoji Palette + Custom) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#191F28] flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-[#4E5968]" />
                <span>대표 아이콘</span>
              </label>
              <span className="text-[12px] text-[#4E5968]">현재: {icon}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap p-2.5 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
              {PRESET_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[17px] transition-all cursor-pointer ${
                    icon === emoji
                      ? "bg-white shadow-xs border border-[#3182F6] scale-110"
                      : "hover:bg-[#E5E8EB]/60 active:scale-95"
                  }`}
                  title={`${emoji} 선택`}
                >
                  {emoji}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1">
                <input
                  type="text"
                  maxLength={2}
                  value={PRESET_EMOJIS.includes(icon) ? "" : icon}
                  onChange={(e) => {
                    if (e.target.value) setIcon(e.target.value);
                  }}
                  placeholder="직접"
                  className="w-11 h-8 rounded-lg bg-white border border-[#E5E8EB] text-center text-[13px] focus:outline-hidden focus:border-[#3182F6]"
                  title="직접 이모지 입력"
                />
              </div>
            </div>
          </div>

          {/* 5. Badge Selector */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#191F28] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#4E5968]" />
                <span>뱃지 라벨</span>
                <span className="text-[#8B95A1] font-normal text-[12px]">(선택)</span>
              </label>
              {badge && (
                <button
                  type="button"
                  onClick={() => setBadge("")}
                  className="text-[11px] text-[#8B95A1] hover:text-[#191F28] cursor-pointer"
                >
                  지우기
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESET_BADGES.map((preset) => {
                const isSelected = badge === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBadge(isSelected ? "" : preset)}
                    className={`px-2.5 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#3182F6] text-white shadow-2xs"
                        : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Live Card Preview (TDS Card Style) */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[12px] font-bold text-[#8B95A1]">실시간 카드 미리보기</span>
            <div className="w-full rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB] p-3.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-2xs border border-[#E5E8EB]/50">
                  <span>{icon || "🔗"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className={`text-[15px] font-semibold truncate ${title ? "text-[#191F28]" : "text-[#B0B8C1]"}`}>
                      {title || "새 링크 제목"}
                    </p>
                    {badge && (
                      <Badge variant="brand" className="text-[10px] px-1.5 py-0">
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#6B7684] truncate">
                    {subtitle || (url ? url : "링크 설명이 여기에 표시돼요")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#B0B8C1] shrink-0" />
              </div>
            </div>
          </div>

          {/* Actions Button Bar */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1 h-12 rounded-xl text-[14px]"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1 h-12 rounded-xl text-[14px] font-bold bg-[#3182F6] hover:bg-[#1B64DA] shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>링크 등록하기</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
