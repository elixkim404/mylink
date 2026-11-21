import {
  createStandardOgImage,
  OG_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "../lib/ogImage";

export const dynamic = "force-static";
export const alt = "마이링크 | 나만의 퍼블릭 링크 & 프로필";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return createStandardOgImage({
    badge: "Public Link in Bio",
    title: "나만의 퍼블릭 링크 & 프로필",
    subtitle: "구글 로그인으로 10초 만에 시작하고, SNS·포트폴리오·블로그를 한곳에서 공유하세요.",
    routeLabel: "elixkim404.github.io/mylink",
  });
}
