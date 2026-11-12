"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Sparkles,
  Globe,
  Smile,
  Tag,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
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

// PRD F-04 및 보안 규격에 맞춘 Zod 스키마 정의
export const linkFormSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "링크 URL 주소를 입력해주세요.")
    .refine((val) => !/\s/.test(val), "URL 주소에 공백이 포함될 수 없어요.")
    .refine((val) => {
      const lower = val.toLowerCase();
      return (
        !lower.startsWith("javascript:") &&
        !lower.startsWith("data:") &&
        !lower.startsWith("vbscript:") &&
        !lower.startsWith("file:")
      );
    }, "보안상 허용되지 않는 안전하지 않은 URL이에요.")
    .max(2048, "URL 주소는 최대 2,048자 이하로 입력해주세요.")
    .refine((val) => {
      const lower = val.toLowerCase();
      if (lower.startsWith("mailto:")) {
        const email = val.slice(7);
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }
      try {
        const target =
          lower.startsWith("http://") || lower.startsWith("https://")
            ? val
            : `https://${val}`;
        const parsed = new URL(target);
        return Boolean(
          parsed.hostname &&
            parsed.hostname.includes(".") &&
            !parsed.hostname.endsWith(".")
        );
      } catch {
        return false;
      }
    }, "올바른 웹 주소 형식(예: https://example.com)을 입력해주세요."),
  title: z
    .string()
    .trim()
    .min(1, "링크 제목을 입력해주세요.")
    .max(60, "제목은 최대 60자까지 입력 가능해요."),
  subtitle: z
    .string()
    .max(100, "상세 설명은 최대 100자까지 입력 가능해요.")
    .optional()
    .or(z.literal("")),
  icon: z.string(),
  badge: z
    .string()
    .max(15, "뱃지 라벨은 최대 15자까지 입력 가능해요.")
    .optional()
    .or(z.literal("")),
});

export type LinkFormValues = z.infer<typeof linkFormSchema>;

// PRD SC-U02 스마트 OGP 메타데이터 감지 모킹 함수 (Phase 0 로컬 전용)
function detectUrlMetadata(url: string) {
  const cleanUrl = url.trim().toLowerCase();
  if (!cleanUrl) return null;

  if (cleanUrl.includes("github.com")) {
    const rawParts = url.trim().split("github.com/")[1]?.split("/") || [];
    const repo = rawParts[1]
      ? `GitHub - ${rawParts[1]}`
      : rawParts[0]
      ? `GitHub (@${rawParts[0]})`
      : "GitHub 프로필";
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
    const handle =
      url.trim().split("instagram.com/")[1]?.split("/")[0]?.replace("@", "") ||
      "";
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
    const parsed = new URL(
      cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`
    );
    const host = parsed.hostname.replace(/^www\./, "");
    if (host && host.includes(".")) {
      return {
        title: `${host} 바로가기`,
        icon: "🔗",
        badge: "Link",
        subtitle: `${host} 공식 페이지`,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// 올바른 형식의 웹 주소인지 엄격하게 검증하는 헬퍼 함수
export function isValidWebUrl(urlStr: string): boolean {
  if (!urlStr) return false;
  const trimmed = urlStr.trim();
  if (!trimmed || trimmed.length < 4) return false;
  if (/\s/.test(trimmed)) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }
  if (lower.startsWith("mailto:")) {
    const email = trimmed.slice(7);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  try {
    const target =
      lower.startsWith("http://") || lower.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;
    const parsed = new URL(target);
    if (
      !parsed.hostname ||
      !parsed.hostname.includes(".") ||
      parsed.hostname.startsWith(".") ||
      parsed.hostname.endsWith(".") ||
      parsed.hostname.length < 4
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function AddLinkDialog({ isOpen, onClose, onAddLink }: AddLinkDialogProps) {
  const [isSmartFilled, setIsSmartFilled] = useState(false);

  // React Hook Form 설정 (Zod Resolver 연결 및 실시간 onChange 검증)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    setError,
    clearErrors,
    setFocus,
    formState: { errors, touchedFields },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      url: "",
      title: "",
      subtitle: "",
      icon: "🔗",
      badge: "",
    },
    mode: "onChange",
  });

  const urlValue = useWatch({ control, name: "url" }) || "";
  const titleValue = useWatch({ control, name: "title" }) || "";
  const subtitleValue = useWatch({ control, name: "subtitle" }) || "";
  const iconValue = useWatch({ control, name: "icon" }) || "🔗";
  const badgeValue = useWatch({ control, name: "badge" }) || "";

  const handleClose = () => {
    reset({
      url: "",
      title: "",
      subtitle: "",
      icon: "🔗",
      badge: "",
    });
    setIsSmartFilled(false);
    onClose();
  };

  // URL 입력 변경 시 처리: 주소만 입력 중이고 제목이 비어있으면 제목 경고 표시
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setValue("url", newUrl, { shouldValidate: true, shouldTouch: true });

    if (!newUrl.trim()) {
      setError("url", {
        type: "manual",
        message: "링크 URL 주소를 입력해주세요.",
      });
    }

    // 스마트 OGP 감지
    const detected = detectUrlMetadata(newUrl);
    if (detected) {
      setIsSmartFilled(true);
      setValue("title", detected.title, { shouldValidate: true, shouldTouch: true });
      setValue("subtitle", detected.subtitle, { shouldValidate: true });
      setValue("icon", detected.icon);
      setValue("badge", detected.badge, { shouldValidate: true });
      clearErrors("title");
    } else {
      // 스마트 감지가 되지 않는 주소이고 제목이 아직 비어있다면 제목 입력 경고 즉시 표시
      if (!titleValue.trim()) {
        setError("title", {
          type: "manual",
          message: "링크 제목을 입력해주세요.",
        });
      }
    }
  };

  // 제목 입력 변경 시 처리: 제목만 입력 중이고 URL이 비어있으면 URL 경고 표시
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, 60);
    setValue("title", newTitle, { shouldValidate: true, shouldTouch: true });

    if (!newTitle.trim()) {
      setError("title", {
        type: "manual",
        message: "링크 제목을 입력해주세요.",
      });
    } else {
      clearErrors("title");
    }

    // 제목만 입력하고 URL이 아직 비어있으면 URL 경고 메시지 즉각 노출
    if (!urlValue.trim()) {
      setError("url", {
        type: "manual",
        message: "링크 URL 주소를 입력해주세요.",
      });
    }
  };

  // URL 필드 포커스 아웃 시
  const handleUrlBlur = () => {
    if (!urlValue.trim()) {
      setError("url", {
        type: "manual",
        message: "링크 URL 주소를 입력해주세요.",
      });
    }
    if (!titleValue.trim()) {
      setError("title", {
        type: "manual",
        message: "링크 제목을 입력해주세요.",
      });
    }
  };

  // 제목 필드 포커스 아웃 시
  const handleTitleBlur = () => {
    if (!titleValue.trim()) {
      setError("title", {
        type: "manual",
        message: "링크 제목을 입력해주세요.",
      });
    }
    if (!urlValue.trim()) {
      setError("url", {
        type: "manual",
        message: "링크 URL 주소를 입력해주세요.",
      });
    }
  };

  // 폼 제출 핸들러 (제목만 입력 또는 주소만 입력 시 모두 확실하게 경고 노출)
  const onSubmit = (data: LinkFormValues) => {
    const trimmedUrl = (data.url || "").trim();
    const trimmedTitle = (data.title || "").trim();

    let hasError = false;

    // URL 검증
    if (!trimmedUrl) {
      setError("url", {
        type: "manual",
        message: "링크 URL 주소를 입력해주세요.",
      });
      hasError = true;
    } else if (!isValidWebUrl(trimmedUrl)) {
      setError("url", {
        type: "manual",
        message: "올바른 웹 주소 형식(예: https://example.com)을 입력해주세요.",
      });
      hasError = true;
    }

    // 제목 검증
    if (!trimmedTitle) {
      setError("title", {
        type: "manual",
        message: "링크 제목을 입력해주세요.",
      });
      hasError = true;
    }

    // 하나라도 누락 또는 오류 시 에러 표시 및 차단
    if (hasError) {
      if (!trimmedUrl || !isValidWebUrl(trimmedUrl)) {
        setFocus("url");
      } else {
        setFocus("title");
      }
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
      subtitle: data.subtitle?.trim() || undefined,
      icon: data.icon || "🔗",
      badge: data.badge?.trim() || undefined,
      is_active: true,
      sort_order: 1, // 최상단에 배치
    });

    handleClose();
  };

  const { ref: urlRegisterRef, ...urlRegisterProps } = register("url");
  const { ref: titleRegisterRef, ...titleRegisterProps } = register("title");
  const { ref: subtitleRegisterRef, ...subtitleRegisterProps } = register("subtitle");

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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                {...urlRegisterProps}
                ref={urlRegisterRef}
                id="link-url"
                type="text"
                value={urlValue}
                onChange={handleUrlChange}
                onBlur={handleUrlBlur}
                placeholder="https://notion.so/... 또는 https://github.com/..."
                className={`pl-9 pr-9 text-[13px] ${
                  errors.url
                    ? "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/20"
                    : ""
                }`}
                autoFocus
              />
              <Globe className="w-4 h-4 text-[#8B95A1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {touchedFields.url && !errors.url && urlValue && (
                  <CheckCircle2 className="w-4 h-4 text-[#2B9D5B]" />
                )}
                {urlValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("url", "", { shouldValidate: true, shouldTouch: true });
                      setIsSmartFilled(false);
                      trigger("url");
                    }}
                    className="text-[#8B95A1] hover:text-[#191F28] p-0.5 rounded-full cursor-pointer"
                    aria-label="URL 지우기"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            {errors.url ? (
              <p className="text-[12px] text-[#F04452] font-medium mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.url.message}</span>
              </p>
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
              <span
                className={`text-[11px] tabular-nums font-medium ${
                  titleValue.length >= 60
                    ? "text-[#F04452]"
                    : titleValue.length >= 50
                    ? "text-[#FF9B00]"
                    : "text-[#8B95A1]"
                }`}
              >
                {titleValue.length}/60
              </span>
            </div>
            <Input
              {...titleRegisterProps}
              ref={titleRegisterRef}
              id="link-title"
              type="text"
              value={titleValue}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              placeholder="예: 나만의 개발 포트폴리오"
              className={`text-[13px] ${
                errors.title
                  ? "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/20"
                  : ""
              }`}
            />
            {errors.title && (
              <p className="text-[12px] text-[#F04452] font-medium mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* 3. Subtitle / Description Input Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="link-subtitle" className="text-[13px] font-bold text-[#191F28]">
                상세 설명 <span className="text-[#8B95A1] font-normal text-[12px]">(선택)</span>
              </label>
              <span
                className={`text-[11px] tabular-nums font-medium ${
                  subtitleValue.length >= 100
                    ? "text-[#F04452]"
                    : subtitleValue.length >= 80
                    ? "text-[#FF9B00]"
                    : "text-[#8B95A1]"
                }`}
              >
                {subtitleValue.length}/100
              </span>
            </div>
            <Input
              {...subtitleRegisterProps}
              ref={subtitleRegisterRef}
              id="link-subtitle"
              type="text"
              value={subtitleValue}
              onChange={(e) => {
                setValue("subtitle", e.target.value.slice(0, 100), {
                  shouldValidate: touchedFields.subtitle,
                  shouldTouch: true,
                });
              }}
              placeholder="예: 프로젝트 상세 회고와 기술 스택 모음집"
              className={`text-[13px] ${
                errors.subtitle
                  ? "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/20"
                  : ""
              }`}
            />
            {errors.subtitle && (
              <p className="text-[12px] text-[#F04452] font-medium mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.subtitle.message}</span>
              </p>
            )}
          </div>

          {/* 4. Icon Selector (Emoji Palette + Custom) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#191F28] flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-[#4E5968]" />
                <span>대표 아이콘</span>
              </label>
              <span className="text-[12px] text-[#4E5968]">현재: {iconValue}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap p-2.5 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
              {PRESET_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setValue("icon", emoji, { shouldTouch: true })}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[17px] transition-all cursor-pointer ${
                    iconValue === emoji
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
                  value={PRESET_EMOJIS.includes(iconValue) ? "" : iconValue}
                  onChange={(e) => {
                    if (e.target.value) setValue("icon", e.target.value);
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
              {badgeValue && (
                <button
                  type="button"
                  onClick={() => setValue("badge", "", { shouldTouch: true })}
                  className="text-[11px] text-[#8B95A1] hover:text-[#191F28] cursor-pointer"
                >
                  지우기
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESET_BADGES.map((preset) => {
                const isSelected = badgeValue === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      setValue("badge", isSelected ? "" : preset, {
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
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
            {errors.badge && (
              <p className="text-[12px] text-[#F04452] font-medium mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.badge.message}</span>
              </p>
            )}
          </div>

          {/* 6. Live Card Preview (TDS Card Style) */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[12px] font-bold text-[#8B95A1]">실시간 카드 미리보기</span>
            <div className="w-full rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB] p-3.5 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-2xs border border-[#E5E8EB]/50">
                  <span>{iconValue || "🔗"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p
                      className={`text-[15px] font-semibold truncate ${
                        titleValue ? "text-[#191F28]" : "text-[#B0B8C1]"
                      }`}
                    >
                      {titleValue || "새 링크 제목"}
                    </p>
                    {badgeValue && (
                      <Badge variant="brand" className="text-[10px] px-1.5 py-0">
                        {badgeValue}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#6B7684] truncate">
                    {subtitleValue || (urlValue ? urlValue : "링크 설명이 여기에 표시돼요")}
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
