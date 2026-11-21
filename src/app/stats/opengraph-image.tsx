import {
  createStandardOgImage,
  OG_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "../../lib/ogImage";

export const dynamic = "force-static";
export const alt = "마이링크 | 클릭 통계 대시보드";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return createStandardOgImage({
    badge: "Analytics",
    title: "클릭 통계 & 성과 분석",
    subtitle: "방문자가 어떤 링크를 얼마나 클릭했는지 직관적인 차트와 순위로 한눈에 확인하세요.",
    routeLabel: "elixkim404.github.io/mylink/stats",
  });
}
