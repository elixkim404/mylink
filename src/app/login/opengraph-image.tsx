import {
  createStandardOgImage,
  OG_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "../../lib/ogImage";

export const dynamic = "force-static";
export const alt = "마이링크 | 간편 로그인";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return createStandardOgImage({
    badge: "Quick Start",
    title: "구글로 10초 만에 시작하기",
    subtitle: "복잡한 가입 없이 Google 계정으로 로그인하고 나만의 퍼블릭 링크를 만들어보세요.",
    routeLabel: "elixkim404.github.io/mylink/login",
  });
}
