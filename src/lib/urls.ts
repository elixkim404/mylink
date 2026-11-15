/**
 * MyLink 서비스 URL 생성 및 관리 헬퍼 (GitHub Pages 배포 및 로컬 호환)
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * 프로덕션 서비스 기준 기본 URL을 반환합니다.
 * 학교 과제 제출 양식에 맞춘 기본값: 'https://elixkim404.github.io/mylink'
 */
export function getBaseAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "https://elixkim404.github.io/mylink";
}

/**
 * 특정 userId(user.uid)에 대한 퍼블릭 프로필 전체 공유/복사 URL을 반환합니다.
 * 예: https://elixkim404.github.io/mylink/{userId}
 */
export function getUserProfileFullUrl(userId?: string): string {
  const base = getBaseAppUrl();
  const cleanId = userId ? userId.trim() : "";
  return cleanId ? `${base}/${cleanId}` : `${base}/`;
}

/**
 * Next.js 내부 라우터 이동용 상대 경로를 반환합니다.
 * 예: /{userId}
 */
export function getUserProfilePath(userId?: string): string {
  const cleanId = userId ? userId.trim() : "";
  return cleanId ? `/${cleanId}` : "/";
}

/**
 * GitHub Pages 서브패스(/mylink) 환경에서도 정적 이미지(/images/...)가 깨지지 않도록 경로를 보정합니다.
 */
export function withBasePath(path?: string): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (BASE_PATH && !normalizedPath.startsWith(`${BASE_PATH}/`)) {
    return `${BASE_PATH}${normalizedPath}`;
  }
  return normalizedPath;
}
