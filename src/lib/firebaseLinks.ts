import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { LinkItem } from "../types/mylink";

// Firestore 링크 컬렉션 경로: users/anonymous/links
export const FIREBASE_LINKS_COLLECTION = "users/anonymous/links";

/**
 * 다양한 형태의 날짜/타임스탬프를 밀리초 숫자(number)로 변환하는 헬퍼 함수
 */
export function getTimestampNumber(val: unknown): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    if (typeof obj.toMillis === "function") return (obj.toMillis as () => number)();
    if (typeof obj.toDate === "function") return (obj.toDate as () => Date)().getTime();
    if (typeof obj.seconds === "number") {
      const nanos = typeof obj.nanoseconds === "number" ? obj.nanoseconds : 0;
      return obj.seconds * 1000 + nanos / 1e6;
    }
  }
  const parsed = new Date(val as string | number | Date).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Firebase Firestore (users/anonymous/links)에 새 링크를 추가합니다.
 */
export async function addFirebaseLink(
  newLinkData: Omit<LinkItem, "id" | "click_count">
): Promise<LinkItem> {
  const rawUrl = (newLinkData.url || "").trim();
  const rawTitle = (newLinkData.title || "").trim();

  if (!rawUrl || rawUrl === "https://" || rawUrl === "http://" || !rawTitle) {
    throw new Error("올바른 URL과 제목이 필요합니다.");
  }

  // Firestore는 undefined 필드를 허용하지 않으므로 정제
  const docPayload: Record<string, unknown> = {
    title: rawTitle,
    url: rawUrl,
    icon: newLinkData.icon || "🔗",
    is_active: newLinkData.is_active ?? true,
    sort_order: newLinkData.sort_order ?? 1,
    click_count: 0,
    createdAt: serverTimestamp(),
  };

  if (newLinkData.subtitle && newLinkData.subtitle.trim()) {
    docPayload.subtitle = newLinkData.subtitle.trim();
  }

  if (newLinkData.badge && newLinkData.badge.trim()) {
    docPayload.badge = newLinkData.badge.trim();
  }

  const linksCollectionRef = collection(db, "users", "anonymous", "links");
  const docRef = await addDoc(linksCollectionRef, docPayload);

  return {
    id: docRef.id,
    title: rawTitle,
    subtitle: (docPayload.subtitle as string | undefined) || undefined,
    url: rawUrl,
    icon: (docPayload.icon as string) || "🔗",
    badge: (docPayload.badge as string | undefined) || undefined,
    is_active: (docPayload.is_active as boolean) ?? true,
    sort_order: (docPayload.sort_order as number) ?? 1,
    click_count: 0,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Firebase Firestore (users/anonymous/links)에서 링크 목록을 불러옵니다.
 * createdAt 기준 최신순(내림차순) 정렬
 */
export async function getFirebaseLinks(): Promise<LinkItem[]> {
  const linksCollectionRef = collection(db, "users", "anonymous", "links");

  try {
    // 1차 시도: createdAt 기준 최신순(desc) 쿼리
    const q = query(linksCollectionRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || "",
        subtitle: data.subtitle || undefined,
        url: data.url || "",
        icon: data.icon || "🔗",
        badge: data.badge || undefined,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order ?? 1,
        click_count: data.click_count || 0,
        createdAt: data.createdAt,
      };
    });
  } catch (error) {
    console.warn("Firestore createdAt desc 정렬 쿼리 실패, 전체 조회 fallback 시도:", error);
    try {
      // createdAt 필드가 아직 인덱싱 중이거나 누락된 문서를 위한 안전 fallback
      const snapshot = await getDocs(linksCollectionRef);
      const links = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "",
          subtitle: data.subtitle || undefined,
          url: data.url || "",
          icon: data.icon || "🔗",
          badge: data.badge || undefined,
          is_active: data.is_active ?? true,
          sort_order: data.sort_order ?? 1,
          click_count: data.click_count || 0,
          createdAt: data.createdAt,
        };
      });

      // 클라이언트에서 createdAt 최신순 정렬
      return links.sort((a, b) => {
        const timeA = getTimestampNumber(a.createdAt);
        const timeB = getTimestampNumber(b.createdAt);
        if (timeA !== timeB) return timeB - timeA;
        return (a.sort_order ?? 1) - (b.sort_order ?? 1);
      });
    } catch (fallbackError) {
      console.warn("Firestore 링크 목록 로드 최종 실패:", fallbackError);
      return [];
    }
  }
}


/**
 * Firebase Firestore (users/anonymous/links/{linkId})의 클릭 카운트를 1 증가시킵니다.
 */
export async function incrementFirebaseLinkClick(linkId: string): Promise<void> {
  try {
    const docRef = doc(db, "users", "anonymous", "links", linkId);
    await updateDoc(docRef, {
      click_count: increment(1),
    });
  } catch (error) {
    console.warn("Firestore 클릭 카운트 업데이트 실패:", error);
  }
}
