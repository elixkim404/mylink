import {
  createStandardOgImage,
  OG_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "../../lib/ogImage";

export const dynamic = "force-static";
export const alt = "마이링크 | 프로필 & 링크 관리";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return createStandardOgImage({
    badge: "Profile Studio",
    title: "프로필 & 링크 관리",
    subtitle: "프로필 정보와 대표 링크, 소셜 채널을 손쉽게 편집하고 실시간으로 반영하세요.",
    routeLabel: "elixkim404.github.io/mylink/edit",
  });
}
