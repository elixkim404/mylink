import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { UserProfileDoc } from "../types/mylink";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_CONTENT_TYPE = "image/png";

interface OgFont {
  name: string;
  data: Buffer;
  weight: 500 | 700;
  style: "normal";
}

let cachedFontsPromise: Promise<OgFont[]> | null = null;

async function loadPretendardFonts(): Promise<OgFont[]> {
  if (!cachedFontsPromise) {
    cachedFontsPromise = (async () => {
      const fontsDir = path.join(process.cwd(), "src", "assets", "fonts");
      const [mediumData, boldData] = await Promise.all([
        fs.readFile(path.join(fontsDir, "Pretendard-Medium.woff")),
        fs.readFile(path.join(fontsDir, "Pretendard-Bold.woff")),
      ]);

      return [
        {
          name: "Pretendard",
          data: mediumData,
          weight: 500,
          style: "normal",
        },
        {
          name: "Pretendard",
          data: boldData,
          weight: 700,
          style: "normal",
        },
      ];
    })();
  }

  return cachedFontsPromise;
}

export interface StandardOgOptions {
  badge?: string;
  title?: string;
  subtitle?: string;
  routeLabel?: string;
}

/**
 * 일반 경로(/, /edit, /login, /stats)용 통일된 OG 이미지를 생성합니다.
 */
export async function createStandardOgImage(options: StandardOgOptions = {}) {
  const {
    badge = "MyLink",
    title = "나만의 퍼블릭 링크 & 프로필",
    subtitle = "SNS, 포트폴리오, 블로그 링크를 하나의 페이지에 깔끔하게 담아 공유하세요.",
    routeLabel = "mylink",
  } = options;

  const fonts = await loadPretendardFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F2F4F6",
          backgroundImage:
            "radial-gradient(circle at 88% 16%, rgba(49, 130, 246, 0.14) 0%, rgba(49, 130, 246, 0) 46%), radial-gradient(circle at 12% 88%, rgba(49, 130, 246, 0.08) 0%, rgba(49, 130, 246, 0) 42%)",
          padding: "48px 56px",
          fontFamily: "Pretendard",
        }}
      >
        {/* 메인 화이트 카드 */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
            borderRadius: "32px",
            border: "1px solid #E5E8EB",
            boxShadow: "0 20px 50px rgba(25, 31, 40, 0.06)",
            padding: "48px 56px",
          }}
        >
          {/* 상단 브랜드 & 배지 바 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  backgroundColor: "#3182F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                M
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#191F28",
                    letterSpacing: "-0.02em",
                  }}
                >
                  MyLink
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#E8F3FF",
                color: "#3182F6",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              <span>{badge}</span>
            </div>
          </div>

          {/* 중앙 타이틀 및 설명 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "920px",
            }}
          >
            <div
              style={{
                fontSize: "54px",
                fontWeight: 700,
                color: "#191F28",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 500,
                color: "#4E5968",
                lineHeight: 1.45,
                letterSpacing: "-0.015em",
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* 하단 UI 프리뷰 칩 & 경로 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: "24px",
              borderTop: "1px solid #F2F4F6",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E8EB",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontSize: "17px",
                  fontWeight: 500,
                  color: "#333D4B",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#3182F6",
                  }}
                />
                <span>링크 관리</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E8EB",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontSize: "17px",
                  fontWeight: 500,
                  color: "#333D4B",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#2B9D5B",
                  }}
                />
                <span>클릭 통계</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E8EB",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontSize: "17px",
                  fontWeight: 500,
                  color: "#333D4B",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: "#F59E0B",
                  }}
                />
                <span>퍼블릭 프로필</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
                fontWeight: 500,
                color: "#8B95A1",
              }}
            >
              {routeLabel}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts,
    }
  );
}

export interface ProfileOgOptions {
  userId: string;
  profile?: UserProfileDoc | null;
}

/**
 * 동적 경로(/[userId])용 디자인 시스템 기반 프로필 OG 이미지를 생성합니다.
 */
export async function createProfileOgImage({ userId, profile }: ProfileOgOptions) {
  const fonts = await loadPretendardFonts();

  const decodedId = (() => {
    try {
      return decodeURIComponent(userId).replace(/^@+/, "");
    } catch {
      return userId.replace(/^@+/, "");
    }
  })();

  const isPlaceholder = !decodedId || decodedId === "me";
  const displayName =
    profile?.display_name || (isPlaceholder ? "마이링크 크리에이터" : decodedId);
  const handle = profile?.handle || (isPlaceholder ? "mylink" : decodedId);
  const badge = profile?.badge || "Public Profile";
  const bio =
    profile?.bio ||
    "나만의 링크와 소셜 채널을 한곳에서 만나보세요. MyLink로 간편하게 연결됩니다.";

  const initial = displayName.slice(0, 1).toUpperCase() || "M";
  const trimmedBio = bio.length > 74 ? `${bio.slice(0, 74)}...` : bio;

  const previewLinks = [
    {
      title: "포트폴리오 & 프로젝트",
      sub: "대표 작업물과 아카이브 보기",
      dotColor: "#3182F6",
      bgColor: "#E8F3FF",
    },
    {
      title: "소셜 & 커뮤니티 채널",
      sub: `@${handle} 공식 채널 연결`,
      dotColor: "#2B9D5B",
      bgColor: "#E6F7ED",
    },
    {
      title: "문의 & 협업 제안",
      sub: "프로필에서 바로 연락하기",
      dotColor: "#F59E0B",
      bgColor: "#FEF3C7",
    },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#F2F4F6",
          backgroundImage:
            "radial-gradient(circle at 86% 18%, rgba(49, 130, 246, 0.18) 0%, rgba(49, 130, 246, 0) 45%), radial-gradient(circle at 14% 86%, rgba(49, 130, 246, 0.10) 0%, rgba(49, 130, 246, 0) 42%)",
          padding: "44px 52px",
          fontFamily: "Pretendard",
        }}
      >
        {/* 메인 컨테이너 카드 */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: "36px",
            backgroundColor: "#FFFFFF",
            borderRadius: "34px",
            border: "1px solid #E5E8EB",
            boxShadow: "0 24px 60px rgba(25, 31, 40, 0.08)",
            padding: "46px 50px",
          }}
        >
          {/* 좌측: 프로필 히어로 영역 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "560px",
            }}
          >
            {/* 상단 브랜드 태그 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  backgroundColor: "#3182F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "17px",
                  fontWeight: 700,
                }}
              >
                M
              </div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#4E5968",
                  letterSpacing: "-0.01em",
                }}
              >
                MyLink
              </span>
              <span style={{ fontSize: "18px", color: "#D1D6DB" }}>•</span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#8B95A1",
                }}
              >
                링크 인 바이오
              </span>
            </div>

            {/* 중앙 아바타 + 이름 + 소개 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                {/* 아바타 서클 */}
                <div
                  style={{
                    width: "96px",
                    height: "96px",
                    borderRadius: "999px",
                    backgroundColor: "#E8F3FF",
                    border: "3px solid #3182F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                    fontWeight: 700,
                    color: "#3182F6",
                  }}
                >
                  {initial}
                </div>

                {/* 이름 + 배지 + 핸들 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        fontSize: "38px",
                        fontWeight: 700,
                        color: "#191F28",
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {displayName}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#E8F3FF",
                        color: "#3182F6",
                        padding: "5px 14px",
                        borderRadius: "999px",
                        fontSize: "15px",
                        fontWeight: 700,
                      }}
                    >
                      {badge}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      color: "#8B95A1",
                    }}
                  >
                    @{handle}
                  </span>
                </div>
              </div>

              {/* 소개글 */}
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 500,
                  color: "#4E5968",
                  lineHeight: 1.5,
                  letterSpacing: "-0.015em",
                }}
              >
                {trimmedBio}
              </div>
            </div>

            {/* 하단 URL 필 */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#F2F4F6",
                  padding: "12px 20px",
                  borderRadius: "16px",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#333D4B",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    backgroundColor: "#3182F6",
                  }}
                />
                <span>elixkim404.github.io/mylink/@{handle}</span>
              </div>
            </div>
          </div>

          {/* 우측: 링크 카드 스택 프리뷰 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
              width: "400px",
              backgroundColor: "#F9FAFB",
              borderRadius: "26px",
              border: "1px solid #E5E8EB",
              padding: "26px",
            }}
          >
            {previewLinks.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E8EB",
                  borderRadius: "18px",
                  padding: "18px 20px",
                  boxShadow: "0 4px 12px rgba(25, 31, 40, 0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor: item.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "999px",
                        backgroundColor: item.dotColor,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        color: "#191F28",
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#8B95A1",
                      }}
                    >
                      {item.sub}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#3182F6",
                  }}
                >
                  →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts,
    }
  );
}
