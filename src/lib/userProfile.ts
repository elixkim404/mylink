import type { User } from "firebase/auth";
import type { UserProfileDoc } from "../types/mylink";
import { getFirebaseDb } from "./firebase";

/**
 * Next.js SSR 및 클라이언트 환경 호환성을 위해 Firestore 모듈을 동적으로 로드합니다.
 */
async function getFirestoreContext() {
  const firestore = await import("firebase/firestore");
  const db = await getFirebaseDb();
  return { firestore, db };
}

/**
 * users/(user.uid) 경로의 유저 프로필 문서를 조회합니다.
 */
export async function getUserProfile(uid: string): Promise<UserProfileDoc | null> {
  if (!uid) return null;

  try {
    const { firestore, db } = await getFirestoreContext();
    const { doc, getDoc } = firestore;

    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      return snap.data() as UserProfileDoc;
    }
    return null;
  } catch (error) {
    console.warn(`users/${uid} 프로필 조회 실패:`, error);
    return null;
  }
}

/**
 * displayName으로 유저 프로필 문서를 검색합니다.
 * - 1차: display_name 필드로 검색
 * - 2차: handle 필드로 검색 (fallback)
 */
export async function getUserProfileByDisplayName(
  displayName: string
): Promise<UserProfileDoc | null> {
  const cleanName = displayName
    ? decodeURIComponent(displayName).trim().replace(/^@+/, "")
    : "";
  if (!cleanName) return null;

  try {
    const { firestore, db } = await getFirestoreContext();
    const { collection, query, where, getDocs, limit } = firestore;

    const usersRef = collection(db, "users");

    // 1. display_name 일치 검색
    const nameQuery = query(usersRef, where("display_name", "==", cleanName), limit(1));
    const snap = await getDocs(nameQuery);

    if (!snap.empty) {
      const docSnap = snap.docs[0];
      const docData = docSnap.data() as UserProfileDoc;
      return {
        ...docData,
        uid: docData.uid || docSnap.id,
      };
    }

    // 2. handle 일치 검색 (대소문자/소셜 계정 고려 fallback)
    const handleQuery = query(usersRef, where("handle", "==", cleanName), limit(1));
    const handleSnap = await getDocs(handleQuery);

    if (!handleSnap.empty) {
      const docSnap = handleSnap.docs[0];
      const docData = docSnap.data() as UserProfileDoc;
      return {
        ...docData,
        uid: docData.uid || docSnap.id,
      };
    }

    return null;
  } catch (error) {
    console.warn(`유저 검색(${cleanName}) 실패:`, error);
    return null;
  }
}

/**
 * Firestore 동기화가 일시 실패하더라도 기본 프로필 객체를 안전하게 생성합니다.
 */
export function buildFallbackProfile(user: User): UserProfileDoc {
  const emailPrefix = user.email ? user.email.split("@")[0] : `user_${user.uid.slice(0, 6)}`;
  const defaultDisplayName = emailPrefix.slice(0, 30) || "마이링크 회원";
  const defaultHandle =
    (emailPrefix.replace(/[^a-zA-Z0-9_]/g, "") || `user_${user.uid.slice(0, 6)}`).slice(0, 30);
  const defaultPhotoUrl = user.photoURL || "/images/avatar.svg";

  const socials: { email?: string } = {};
  if (user.email) {
    socials.email = `mailto:${user.email}`;
  }

  return {
    uid: user.uid,
    email: user.email || "",
    display_name: defaultDisplayName,
    handle: defaultHandle,
    badge: "Google 연동",
    bio: "안녕하세요! 나만의 링크를 모아둔 마이링크 프로필이에요 ✨",
    avatar_url: defaultPhotoUrl,
    socials,
  };
}

/**
 * 구글 로그인 완료 시 users/(user.uid) 경로에 유저 정보를 동기화합니다.
 * 문서가 없으면 초기 유저 정보를 등록하고, 있으면 lastLoginAt을 업데이트합니다.
 */
export async function syncUserProfileOnLogin(user: User): Promise<UserProfileDoc> {
  const { firestore, db } = await getFirestoreContext();
  const { doc, getDoc, setDoc, updateDoc, serverTimestamp } = firestore;

  const userDocRef = doc(db, "users", user.uid);
  const snap = await getDoc(userDocRef);

  // 구글 이메일 앞부분을 display_name 및 기본 핸들명으로 사용 (firestore.rules 30자 제한 준수)
  const fallback = buildFallbackProfile(user);
  const defaultDisplayName = fallback.display_name;
  const defaultHandle = fallback.handle;
  const defaultPhotoUrl = fallback.avatar_url;

  if (!snap.exists()) {
    // 최초 로그인 시 새 프로필 문서 생성 (Firestore는 undefined 값을 허용하지 않음)
    const newProfile: UserProfileDoc = {
      ...fallback,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userDocRef, newProfile);
    return newProfile;
  } else {
    // 기존 문서가 있을 경우
    const data = snap.data() as UserProfileDoc;
    // 기존 display_name이 없거나 구글 전체 이름(user.displayName)과 같을 경우 이메일 앞부분으로 갱신
    const currentDisplayName = (
      data.display_name && data.display_name !== user.displayName
        ? data.display_name
        : defaultDisplayName
    ).slice(0, 30);

    await updateDoc(userDocRef, {
      lastLoginAt: serverTimestamp(),
      display_name: currentDisplayName,
    });

    return {
      ...data,
      uid: user.uid,
      email: data.email || user.email || "",
      display_name: currentDisplayName,
      handle: data.handle || defaultHandle,
      avatar_url: data.avatar_url || defaultPhotoUrl,
    };
  }
}

/**
 * users/(user.uid) 경로의 유저 프로필 정보를 업데이트합니다.
 */
export async function updateUserProfile(
  uid: string,
  updatedData: Partial<UserProfileDoc>
): Promise<void> {
  if (!uid) throw new Error("사용자 UID가 필요합니다.");

  const { firestore, db } = await getFirestoreContext();
  const { doc, updateDoc, serverTimestamp, deleteField } = firestore;

  const userDocRef = doc(db, "users", uid);
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updatedData.display_name !== undefined) {
    payload.display_name = updatedData.display_name.trim();
  }
  if (updatedData.handle !== undefined) {
    payload.handle = updatedData.handle.trim().replace(/^@+/, "");
  }
  if (updatedData.bio !== undefined) {
    payload.bio = updatedData.bio;
  }
  if (updatedData.badge !== undefined) {
    const trimmed = updatedData.badge.trim();
    payload.badge = trimmed ? trimmed : deleteField();
  }
  if (updatedData.avatar_url !== undefined) {
    payload.avatar_url = updatedData.avatar_url;
  }
  if (updatedData.socials !== undefined) {
    payload.socials = updatedData.socials;
  }

  await updateDoc(userDocRef, payload);
}
