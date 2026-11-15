import { z } from "zod";

export const PRESET_EMOJIS = ["🔗", "💻", "📝", "📚", "🐙", "☕", "🎨", "🚀", "💼", "🎬", "🌟", "💡"];
export const PRESET_BADGES = ["Featured", "Portfolio", "Blog", "Study", "Active", "New"];

// PRD F-04 및 보안 규격에 맞춘 Zod 스키마 정의 (추가 및 인라인 수정 공통 사용)
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

// URL 프로토콜 자동 보정 함수 (http://, https://, mailto: 없으면 https:// 부여)
export function formatUrlWithProtocol(urlStr: string): string {
  const trimmed = (urlStr || "").trim();
  if (!trimmed) return "";
  if (
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("mailto:")
  ) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
