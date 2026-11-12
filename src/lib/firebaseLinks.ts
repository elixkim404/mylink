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
  };
}

/**
 * Firebase Firestore (users/anonymous/links)에서 링크 목록을 불러옵니다.
 */
export async function getFirebaseLinks(): Promise<LinkItem[]> {
  try {
    const linksCollectionRef = collection(db, "users", "anonymous", "links");
    const q = query(linksCollectionRef, orderBy("sort_order", "asc"));
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
      };
    });
  } catch (error) {
    console.warn("Firestore 링크 목록 로드 실패 (로컬 데이터로 대체):", error);
    return [];
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
