import type { LinkItem } from "../types/mylink";
import { getFirebaseDb } from "./firebase";

/**
 * Firestore 링크 컬렉션 경로를 반환합니다: users/(user.uid)/links
 */
export function getUserLinksCollectionPath(userId: string = "anonymous"): string {
  const cleanId = userId && userId.trim() ? userId.trim() : "anonymous";
  return `users/${cleanId}/links`;
}

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
 * 타임스탬프를 상대 시간("방금 전", "3분 전", "2시간 전" 등)으로 변환하는 헬퍼 함수
 */
export function formatRelativeTime(val: unknown): string | null {
  if (!val) return null;
  const timeMs = getTimestampNumber(val);
  if (!timeMs) return null;

  const now = Date.now();
  const diffSec = Math.floor((now - timeMs) / 1000);

  if (diffSec < 60) return "방금 전";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;

  const date = new Date(timeMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * 타임스탬프를 상세 일시("YYYY.MM.DD HH:mm") 문자열로 변환하는 헬퍼 함수
 */
export function formatFullDateTime(val: unknown): string | null {
  if (!val) return null;
  const timeMs = getTimestampNumber(val);
  if (!timeMs) return null;

  const date = new Date(timeMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

/**
 * Next.js SSR 및 Turbopack 환경에서 모듈 팩토리 충돌을 방지하기 위해
 * Firestore 모듈과 DB 인스턴스를 클라이언트에서 동적으로 로드합니다.
 */
async function getFirestoreContext() {
  const firestore = await import("firebase/firestore");
  const db = await getFirebaseDb();
  return { firestore, db };
}

/**
 * Firebase Firestore (users/{userId}/links)에 새 링크를 추가합니다.
 */
export async function addFirebaseLink(
  userId: string,
  newLinkData: Omit<LinkItem, "id" | "click_count">
): Promise<LinkItem> {
  const rawUrl = (newLinkData.url || "").trim();
  const rawTitle = (newLinkData.title || "").trim();

  if (!rawUrl || rawUrl === "https://" || rawUrl === "http://" || !rawTitle) {
    throw new Error("올바른 URL과 제목이 필요합니다.");
  }

  const cleanUserId = userId && userId.trim() ? userId.trim() : "anonymous";
  const { firestore, db } = await getFirestoreContext();
  const { collection, addDoc, serverTimestamp } = firestore;

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

  const linksCollectionRef = collection(db, "users", cleanUserId, "links");
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
 * Firebase Firestore (users/{userId}/links)에서 링크 목록을 불러옵니다.
 * createdAt 기준 최신순(내림차순) 정렬
 */
export async function getFirebaseLinks(userId: string): Promise<LinkItem[]> {
  try {
    const cleanUserId = userId && userId.trim() ? userId.trim() : "anonymous";
    const { firestore, db } = await getFirestoreContext();
    const { collection, getDocs, query, orderBy } = firestore;
    const linksCollectionRef = collection(db, "users", cleanUserId, "links");

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
          click_count: Number(data.click_count) || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
    } catch (error) {
      console.warn("Firestore createdAt desc 정렬 쿼리 실패, 전체 조회 fallback 시도:", error);
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
          click_count: Number(data.click_count) || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });

      // 클라이언트에서 createdAt 최신순 정렬
      return links.sort((a, b) => {
        const timeA = getTimestampNumber(a.createdAt);
        const timeB = getTimestampNumber(b.createdAt);
        if (timeA !== timeB) return timeB - timeA;
        return (a.sort_order ?? 1) - (b.sort_order ?? 1);
      });
    }
  } catch (err) {
    console.warn("Firestore 링크 목록 로드 실패:", err);
    return [];
  }
}

/**
 * Firebase Firestore (users/{userId}/links/{linkId})의 클릭 카운트를 1 증가시킵니다.
 */
export async function incrementFirebaseLinkClick(userId: string, linkId: string): Promise<void> {
  if (!linkId) return;
  try {
    const cleanUserId = userId && userId.trim() ? userId.trim() : "anonymous";
    const { firestore, db } = await getFirestoreContext();
    const { doc, updateDoc, increment } = firestore;
    const docRef = doc(db, "users", cleanUserId, "links", linkId);
    await updateDoc(docRef, {
      click_count: increment(1),
    });
  } catch (error) {
    console.warn("Firestore 클릭 카운트 업데이트 실패:", error);
    throw error;
  }
}

/**
 * Firebase Firestore (users/{userId}/links/{linkId})의 링크 정보를 수정합니다.
 */
export async function updateFirebaseLink(
  userId: string,
  linkId: string,
  updatedData: Partial<Omit<LinkItem, "id">>
): Promise<void> {
  if (!linkId) throw new Error("수정할 링크 ID가 필요합니다.");

  const cleanUserId = userId && userId.trim() ? userId.trim() : "anonymous";
  const { firestore, db } = await getFirestoreContext();
  const { doc, updateDoc, serverTimestamp, deleteField } = firestore;

  const docRef = doc(db, "users", cleanUserId, "links", linkId);
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updatedData.title !== undefined) {
    const rawTitle = updatedData.title.trim();
    if (!rawTitle) throw new Error("링크 제목이 필요합니다.");
    payload.title = rawTitle;
  }

  if (updatedData.url !== undefined) {
    const rawUrl = updatedData.url.trim();
    if (!rawUrl || rawUrl === "https://" || rawUrl === "http://") {
      throw new Error("올바른 URL이 필요합니다.");
    }
    payload.url = rawUrl;
  }

  if (updatedData.subtitle !== undefined) {
    const trimmed = updatedData.subtitle.trim();
    payload.subtitle = trimmed ? trimmed : deleteField();
  }

  if (updatedData.badge !== undefined) {
    const trimmed = updatedData.badge.trim();
    payload.badge = trimmed ? trimmed : deleteField();
  }

  if (updatedData.icon !== undefined) {
    payload.icon = updatedData.icon || "🔗";
  }

  if (updatedData.is_active !== undefined) {
    payload.is_active = updatedData.is_active;
  }

  if (updatedData.sort_order !== undefined) {
    payload.sort_order = updatedData.sort_order;
  }

  await updateDoc(docRef, payload);
}

/**
 * Firebase Firestore (users/{userId}/links/{linkId})에서 링크를 삭제합니다.
 */
export async function deleteFirebaseLink(userId: string, linkId: string): Promise<void> {
  if (!linkId) throw new Error("삭제할 링크 ID가 필요합니다.");
  const cleanUserId = userId && userId.trim() ? userId.trim() : "anonymous";
  const { firestore, db } = await getFirestoreContext();
  const { doc, deleteDoc } = firestore;
  const docRef = doc(db, "users", cleanUserId, "links", linkId);
  await deleteDoc(docRef);
}
