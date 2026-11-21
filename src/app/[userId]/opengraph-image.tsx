import {
  createProfileOgImage,
  OG_CONTENT_TYPE,
  OG_IMAGE_SIZE,
} from "../../lib/ogImage";
import { getUserProfile, getUserProfileByDisplayName } from "../../lib/userProfile";
import type { UserProfileDoc } from "../../types/mylink";

export const dynamic = "force-static";
export const alt = "마이링크 | 퍼블릭 프로필";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [{ userId: "me" }];
}

interface DynamicOgProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function OpenGraphImage({ params }: DynamicOgProps) {
  const { userId } = await params;

  let profile: UserProfileDoc | null = null;

  if (userId && userId !== "me") {
    try {
      profile =
        (await getUserProfile(userId)) ??
        (await getUserProfileByDisplayName(userId));
    } catch {
      profile = null;
    }
  }

  return createProfileOgImage({ userId, profile });
}
