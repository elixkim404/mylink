"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import type { User } from "firebase/auth";
import type { UserProfileDoc } from "../types/mylink";
import { getFirebaseAuth } from "./firebase";
import {
  buildFallbackProfile,
  getUserProfile,
  syncUserProfileOnLogin,
  updateUserProfile,
} from "./userProfile";

/**
 * Firebase Google 로그인 에러 코드를 사용자 친화적인 한국어 메시지로 변환합니다.
 */
export function getGoogleAuthErrorMessage(error: unknown): string {
  const err = error as { code?: string; message?: string } | null;
  const code = err?.code || "";

  switch (code) {
    case "auth/unauthorized-domain":
      return "현재 도메인이 Firebase 승인 도메인에 등록되지 않았어요. Firebase 콘솔에서 도메인을 추가해주세요 ⚠️";
    case "auth/popup-blocked":
      return "브라우저에서 로그인 팝업이 차단되었어요. 팝업 허용 후 다시 시도해주세요 ⚠️";
    case "auth/operation-not-allowed":
      return "Firebase 콘솔에서 Google 로그인 제공업체가 활성화되어 있지 않아요 ⚠️";
    case "auth/network-request-failed":
      return "네트워크 연결을 확인한 뒤 다시 시도해주세요 ⚠️";
    case "auth/invalid-api-key":
    case "auth/configuration-not-found":
      return "Firebase 인증 환경변수(API Key/Auth Domain)를 확인해주세요 ⚠️";
    case "auth/account-exists-with-different-credential":
      return "이미 다른 로그인 방식으로 가입된 이메일 계정이에요 ⚠️";
    default:
      return code
        ? `구글 로그인 중 오류가 발생했어요 (${code}) ⚠️`
        : "구글 로그인 중 문제가 발생했어요. 다시 시도해주세요 ⚠️";
  }
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileDoc | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserProfileDoc | null>;
  signOutUser: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfileDoc>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => null,
  signOutUser: async () => {},
  updateProfileData: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  // Firebase Auth 상태 구독 (리다이렉트 로그인 결과 포함)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        const auth = await getFirebaseAuth();
        const { onAuthStateChanged, getRedirectResult } = await import("firebase/auth");

        // 팝업 차단 fallback으로 signInWithRedirect를 거친 경우 결과 처리
        getRedirectResult(auth).catch((err) => {
          console.warn("Google 리다이렉트 로그인 결과 확인 중 경고:", err);
        });

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          startTransition(() => {
            setUser(currentUser);
          });

          if (currentUser) {
            try {
              // Firestore users/(user.uid)에서 프로필 동기화
              const profile = await syncUserProfileOnLogin(currentUser);
              setUserProfile(profile);
            } catch (err) {
              console.warn("로그인 유저 프로필 동기화 실패 (기본 프로필 사용):", err);
              setUserProfile(buildFallbackProfile(currentUser));
            }
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Firebase Auth 초기화 실패:", error);
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 구글 소셜 로그인
  const signInWithGoogle = async (): Promise<UserProfileDoc | null> => {
    try {
      setLoading(true);
      const auth = await getFirebaseAuth();
      const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import(
        "firebase/auth"
      );
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      let signedInUser: User;
      try {
        const result = await signInWithPopup(auth, provider);
        signedInUser = result.user;
      } catch (popupErr: unknown) {
        const err = popupErr as { code?: string };
        // 팝업이 차단된 환경에서는 리다이렉트 로그인으로 자동 전환
        if (err.code === "auth/popup-blocked") {
          await signInWithRedirect(auth, provider);
          return null;
        }
        throw popupErr;
      }

      setUser(signedInUser);

      // Firestore users/(user.uid)에 저장/동기화 (동기화 실패 시에도 로그인 자체는 유지)
      let profile: UserProfileDoc;
      try {
        profile = await syncUserProfileOnLogin(signedInUser);
      } catch (syncErr) {
        console.warn("로그인 후 Firestore 프로필 동기화 실패 (기본 프로필 사용):", syncErr);
        profile = buildFallbackProfile(signedInUser);
      }

      setUserProfile(profile);
      setLoading(false);
      return profile;
    } catch (error: unknown) {
      setLoading(false);
      const err = error as { code?: string; message?: string };
      // 사용자가 팝업을 닫거나 중복 요청으로 취소된 경우는 예외 던지지 않음
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        return null;
      }
      console.error("Google 로그인 실패:", err.code || err.message || error);
      throw error;
    }
  };

  // 로그아웃
  const signOutUser = async () => {
    try {
      const auth = await getFirebaseAuth();
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("로그아웃 실패:", error);
      throw error;
    }
  };

  // 프로필 정보 업데이트 (users/{uid}) - 낙관적 업데이트 및 자동 롤백 적용
  const updateProfileData = async (data: Partial<UserProfileDoc>) => {
    if (!user) throw new Error("로그인이 필요합니다.");

    // 1. 이전 프로필 상태 스냅샷 저장
    const previousProfile = userProfile;

    // 2. 서버 응답을 대기하지 않고 UI 상태를 즉시 선반영 (0ms 낙관적 업데이트)
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));

    try {
      // 3. 백그라운드 Firestore 저장 수행
      await updateUserProfile(user.uid, data);
    } catch (error) {
      // 4. 저장 실패 시 이전 상태로 안전하게 자동 롤백
      console.error("프로필 저장 실패, 이전 상태로 롤백:", error);
      setUserProfile(previousProfile);
      throw error;
    }
  };

  // 프로필 다시 조회
  const refreshProfile = async () => {
    if (!user) return;
    const latest = await getUserProfile(user.uid);
    if (latest) {
      setUserProfile(latest);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signOutUser,
        updateProfileData,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
