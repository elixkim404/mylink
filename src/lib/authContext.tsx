"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import type { User } from "firebase/auth";
import type { UserProfileDoc } from "../types/mylink";
import { getFirebaseAuth } from "./firebase";
import { getUserProfile, syncUserProfileOnLogin, updateUserProfile } from "./userProfile";

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

  // Firebase Auth 상태 구독
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        const auth = await getFirebaseAuth();
        const { onAuthStateChanged } = await import("firebase/auth");

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
              console.warn("로그인 유저 프로필 동기화 실패:", err);
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
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      setUser(result.user);

      // Firestore users/(user.uid)에 저장/동기화
      const profile = await syncUserProfileOnLogin(result.user);
      setUserProfile(profile);
      setLoading(false);
      return profile;
    } catch (error: unknown) {
      setLoading(false);
      const err = error as { code?: string; message?: string };
      // 사용자가 팝업을 닫은 경우는 예외 던지지 않음
      if (err.code === "auth/popup-closed-by-user") {
        return null;
      }
      console.error("Google 로그인 실패:", error);
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
