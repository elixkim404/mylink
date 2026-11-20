"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Pencil,
  Trash2,
  X,
  Check,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Globe,
  Smile,
  Tag,
  ExternalLink,
  MousePointerClick,
} from "lucide-react";
import { LinkItem } from "../types/mylink";
import { incrementLinkClick } from "../lib/storage";
import { formatRelativeTime, formatFullDateTime } from "../lib/firebaseLinks";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  linkFormSchema,
  LinkFormValues,
  isValidWebUrl,
  PRESET_EMOJIS,
  PRESET_BADGES,
  formatUrlWithProtocol,
} from "../lib/linkValidation";

interface LinkCardProps {
  link: LinkItem;
  readOnly?: boolean;
  onLinkClick?: (link: LinkItem) => void;
  onUpdateLink?: (
    linkId: string,
    updatedData: Partial<Omit<LinkItem, "id">>
  ) => Promise<void> | void;
  onRequestDelete?: (link: LinkItem) => void;
}

export function LinkCard({
  link,
  readOnly = false,
  onLinkClick,
  onUpdateLink,
  onRequestDelete,
}: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 인라인 편집을 위한 React Hook Form 설정 (AddLinkDialog와 동일한 Zod 스키마 및 실시간 검증 모드)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    setFocus,
    formState: { errors, touchedFields },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      url: link.url,
      title: link.title,
      subtitle: link.subtitle || "",
      icon: link.icon || "🔗",
      badge: link.badge || "",
    },
    mode: "onChange",
  });

  const urlValue = useWatch({ control, name: "url" }) ?? link.url;
  const titleValue = useWatch({ control, name: "title" }) ?? link.title;
  const subtitleValue = useWatch({ control, name: "subtitle" }) ?? (link.subtitle || "");
  const iconValue = useWatch({ control, name: "icon" }) ?? (link.icon || "🔗");
  const badgeValue = useWatch({ control, name: "badge" }) ?? (link.badge || "");

  // 수정 시각(updatedAt) 상대 시간 및 상세 일시 포맷팅
  const relativeUpdated = link.updatedAt ? formatRelativeTime(link.updatedAt) : null;
  const fullUpdated = link.updatedAt ? formatFullDateTime(link.updatedAt) : null;

  // 편집 모드 진입
  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    reset({
      url: link.url,
      title: link.title,
      subtitle: link.subtitle || "",
      icon: link.icon || "🔗",
      badge: link.badge || "",
    });
    setIsEditing(true);
  };

  // 편집 모드 취소
  const handleCancelEdit = () => {
    reset({
      url: link.url,
      title: link.title,
      subtitle: link.subtitle || "",
      icon: link.icon || "🔗",
      badge: link.badge || "",
    });
    setIsEditing(false);
  };

  // 삭제 요청 핸들러
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onRequestDelete) {
      onRequestDelete(link);
    }
  };

  // 링크 클릭 네비게이션
  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick(link);
    } else {
      incrementLinkClick(link.id);
    }
  };

  // 인라인 편집 제출 (추가할 때와 동일한 엄격한 검증 및 프로토콜 보정)
  const onSaveSubmit = async (data: LinkFormValues) => {
    if (isSubmitting) return;

    const trimmedUrl = (data.url || "").trim();
    const trimmedTitle = (data.title || "").trim();

    let hasError = false;

    // URL 유효성 검증
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

    // 제목 유효성 검증
    if (!trimmedTitle) {
      setError("title", {
        type: "manual",
        message: "링크 제목을 입력해주세요.",
      });
      hasError = true;
    }

    if (hasError) {
      if (!trimmedUrl || !isValidWebUrl(trimmedUrl)) {
        setFocus("url");
      } else {
        setFocus("title");
      }
      return;
    }

    const finalUrl = formatUrlWithProtocol(trimmedUrl);

    try {
      setIsSubmitting(true);
      if (onUpdateLink) {
        await onUpdateLink(link.id, {
          url: finalUrl,
          title: trimmedTitle,
          subtitle: data.subtitle?.trim() || undefined,
          icon: data.icon || "🔗",
          badge: data.badge?.trim() || undefined,
        });
      }
      setIsEditing(false);
    } catch (err) {
      console.error("링크 수정 실패:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExternal =
    link.url.startsWith("http://") ||
    link.url.startsWith("https://") ||
    link.url.startsWith("mailto:");

  // ----------------------------------------------------
  // 1. 인라인 편집 UI (isEditing === true)
  // ----------------------------------------------------
  if (isEditing) {
    const { ref: urlRegisterRef, ...urlRegisterProps } = register("url");
    const { ref: titleRegisterRef, ...titleRegisterProps } = register("title");
    const { ref: subtitleRegisterRef, ...subtitleRegisterProps } = register("subtitle");

    return (
      <div className="w-full rounded-2xl border-2 border-[#3182F6] bg-white p-4 sm:p-5 shadow-md animate-in fade-in zoom-in-95 duration-150 text-left">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2F4F6]">
          <div className="flex items-center gap-1.5 flex-wrap text-[#3182F6] text-[13px] font-bold">
            <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>링크 인라인 수정</span>
            {relativeUpdated && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-normal text-[#6B7684] bg-[#F2F4F6] px-1.5 py-0.5 rounded-md"
                title={fullUpdated ? `수정일시: ${fullUpdated}` : "수정됨"}
              >
                <Clock className="w-3 h-3 text-[#8B95A1]" />
                <span>마지막 수정: {relativeUpdated}</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={isSubmitting}
            className="text-[#8B95A1] hover:text-[#191F28] p-1 rounded-full cursor-pointer transition-colors"
            aria-label="편집 취소"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSaveSubmit)} className="flex flex-col gap-3.5">
          {/* URL Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`edit-url-${link.id}`}
              className="text-[12px] font-bold text-[#191F28] flex items-center gap-1"
            >
              <span>URL 주소</span>
              <span className="text-[#F04452]">*</span>
            </label>
            <div className="relative">
              <Input
                {...urlRegisterProps}
                ref={urlRegisterRef}
                id={`edit-url-${link.id}`}
                type="text"
                value={urlValue}
                onChange={(e) => {
                  setValue("url", e.target.value, { shouldValidate: true, shouldTouch: true });
                }}
                placeholder="https://example.com"
                className={`pl-8 pr-8 text-[13px] h-10 ${
                  errors.url
                    ? "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/20"
                    : ""
                }`}
                autoFocus
              />
              <Globe className="w-3.5 h-3.5 text-[#8B95A1] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {touchedFields.url && !errors.url && urlValue && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2B9D5B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>
            {errors.url && (
              <p className="text-[11px] text-[#F04452] font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.url.message}</span>
              </p>
            )}
          </div>

          {/* Title Input */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`edit-title-${link.id}`}
                className="text-[12px] font-bold text-[#191F28] flex items-center gap-1"
              >
                <span>링크 제목</span>
                <span className="text-[#F04452]">*</span>
              </label>
              <span
                className={`text-[10px] tabular-nums font-medium ${
                  titleValue.length >= 60 ? "text-[#F04452]" : "text-[#8B95A1]"
                }`}
              >
                {titleValue.length}/60
              </span>
            </div>
            <Input
              {...titleRegisterProps}
              ref={titleRegisterRef}
              id={`edit-title-${link.id}`}
              type="text"
              value={titleValue}
              onChange={(e) => {
                setValue("title", e.target.value.slice(0, 60), {
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              placeholder="링크 제목 입력"
              className={`text-[13px] h-10 ${
                errors.title
                  ? "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/20"
                  : ""
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-[#F04452] font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* Subtitle Input */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`edit-subtitle-${link.id}`}
                className="text-[12px] font-bold text-[#191F28]"
              >
                상세 설명 <span className="text-[#8B95A1] font-normal text-[11px]">(선택)</span>
              </label>
              <span
                className={`text-[10px] tabular-nums font-medium ${
                  subtitleValue.length >= 100 ? "text-[#F04452]" : "text-[#8B95A1]"
                }`}
              >
                {subtitleValue.length}/100
              </span>
            </div>
            <Input
              {...subtitleRegisterProps}
              ref={subtitleRegisterRef}
              id={`edit-subtitle-${link.id}`}
              type="text"
              value={subtitleValue}
              onChange={(e) => {
                setValue("subtitle", e.target.value.slice(0, 100), {
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              placeholder="링크 상세 설명"
              className="text-[13px] h-10"
            />
          </div>

          {/* Icon Selector (Emoji Palette + Custom) */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-[#191F28] flex items-center gap-1">
                <Smile className="w-3 h-3 text-[#4E5968]" />
                <span>아이콘 선택</span>
              </label>
              <span className="text-[11px] text-[#4E5968]">현재: {iconValue}</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap p-2 bg-[#F9FAFB] rounded-xl border border-[#E5E8EB]">
              {PRESET_EMOJIS.slice(0, 8).map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setValue("icon", emoji, { shouldTouch: true })}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[15px] transition-all cursor-pointer ${
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
                  className="w-10 h-7 rounded-lg bg-white border border-[#E5E8EB] text-center text-[12px] focus:outline-hidden focus:border-[#3182F6]"
                  title="직접 이모지 입력"
                />
              </div>
            </div>
          </div>

          {/* Badge Selector */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-[#191F28] flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#4E5968]" />
                <span>뱃지 라벨</span>
                <span className="text-[#8B95A1] font-normal text-[11px]">(선택)</span>
              </label>
              {badgeValue && (
                <button
                  type="button"
                  onClick={() => setValue("badge", "", { shouldTouch: true })}
                  className="text-[10px] text-[#8B95A1] hover:text-[#191F28] cursor-pointer"
                >
                  지우기
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
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
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
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

          {/* Actions Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#F2F4F6]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="flex-1 h-9.5 rounded-xl text-[13px]"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
              className="flex-1 h-9.5 rounded-xl text-[13px] font-bold bg-[#3182F6] hover:bg-[#1B64DA] shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>수정 완료</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. 기본 카드 뷰 (항상 표시되는 수정/삭제 버튼 포함)
  // ----------------------------------------------------
  return (
    <div className="group relative w-full rounded-2xl border border-[#E5E8EB] bg-white p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-150 hover:border-[#3182F6]/40 hover:shadow-xs">
      <div className="flex items-start justify-between gap-3">
        {/* 링크 메인 콘텐츠 클릭 영역 */}
        <a
          href={link.url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={handleLinkClick}
          className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer outline-hidden group/link"
        >
          {/* Leading Icon / Emoji Box */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F6] text-2xl transition-all duration-150 group-hover/link:bg-[#E8F3FF] group-hover/link:scale-105">
            <span>{link.icon || "🔗"}</span>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#191F28] truncate transition-colors group-hover/link:text-[#3182F6]">
                {link.title}
              </h3>
              {link.badge && (
                <Badge variant="brand" className="text-[10px] sm:text-[11px] px-1.5 py-0.5">
                  {link.badge}
                </Badge>
              )}
            </div>
            {link.subtitle && (
              <p className="mt-0.5 text-[12px] sm:text-[13px] text-[#6B7684] truncate leading-snug">
                {link.subtitle}
              </p>
            )}
            <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-[#8B95A1]">
              <span className="truncate flex items-center gap-1 max-w-[180px] xs:max-w-[220px]">
                <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                <span className="truncate">{link.url}</span>
              </span>
              <span
                className="inline-flex items-center gap-1 text-[10px] text-[#4E5968] bg-[#F2F4F6] px-1.5 py-0.5 rounded-md shrink-0 font-semibold tabular-nums"
                title={`누적 조회수 ${(Number(link.click_count) || 0).toLocaleString()}회`}
              >
                <MousePointerClick className="w-2.5 h-2.5 text-[#3182F6] stroke-[2.2]" />
                <span>조회 {(Number(link.click_count) || 0).toLocaleString()}회</span>
              </span>
              {relativeUpdated && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] text-[#8B95A1] bg-[#F2F4F6] px-1.5 py-0.5 rounded-md shrink-0 font-medium"
                  title={fullUpdated ? `수정일시: ${fullUpdated}` : "수정됨"}
                >
                  <Clock className="w-2.5 h-2.5 stroke-[2]" />
                  <span>수정 {relativeUpdated}</span>
                </span>
              )}
            </div>
          </div>
        </a>

        {/* 액션 버튼 영역 (수정 / 삭제 - readOnly가 아니고 핸들러가 있을 때만 노출) */}
        {!readOnly && (onUpdateLink || onRequestDelete) && (
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            {/* 수정 버튼 */}
            {onUpdateLink && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[#4E5968] bg-[#F2F4F6] hover:bg-[#E5E8EB] hover:text-[#191F28] active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="링크 수정 (인라인 편집)"
                aria-label="링크 수정"
              >
                <Pencil className="w-3.5 h-3.5 text-[#4E5968]" />
                <span>수정</span>
              </button>
            )}

            {/* 삭제 버튼 */}
            {onRequestDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[#F04452] bg-[#FFF0F2] hover:bg-[#FFE0E4] active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="링크 삭제"
                aria-label="링크 삭제"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#F04452]" />
                <span>삭제</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
