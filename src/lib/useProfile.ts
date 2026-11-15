"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProfileDoc } from "../types/mylink";
import { getUserProfile, updateUserProfile, getUserProfileByDisplayName } from "./userProfile";

export const profileQueryKeys = {
  all: ["profile"] as const,
  user: (userId?: string) => ["profile", userId || "anonymous"] as const,
  byDisplayName: (displayName?: string) => ["profile", "byDisplayName", displayName || ""] as const,
};

/**
 * 특정 유저의 Firestore 프로필을 조회하고 캐싱하는 쿼리 훅
 */
export function useProfileQuery(userId?: string) {
  return useQuery({
    queryKey: profileQueryKeys.user(userId),
    queryFn: () => {
      if (!userId) return null;
      return getUserProfile(userId);
    },
    enabled: !!userId,
  });
}

/**
 * displayName으로 Firestore 유저 프로필을 검색 및 캐싱하는 쿼리 훅
 */
export function useProfileByDisplayNameQuery(displayName?: string) {
  return useQuery({
    queryKey: profileQueryKeys.byDisplayName(displayName),
    queryFn: () => {
      if (!displayName) return null;
      return getUserProfileByDisplayName(displayName);
    },
    enabled: !!displayName,
  });
}

/**
 * 프로필 업데이트 Mutation (낙관적 업데이트 및 롤백 지원)
 */
export function useUpdateProfileMutation(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = profileQueryKeys.user(userId);

  return useMutation({
    mutationFn: (updatedData: Partial<UserProfileDoc>) => {
      if (!userId) throw new Error("사용자 UID가 필요합니다.");
      return updateUserProfile(userId, updatedData);
    },
    onMutate: async (updatedData) => {
      // 진행 중인 프로필 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 프로필 스냅샷 백업
      const previousProfile = queryClient.getQueryData<UserProfileDoc | null>(queryKey);

      // 캐시에 즉각 선반영 (0ms 낙관적 업데이트)
      if (previousProfile) {
        queryClient.setQueryData<UserProfileDoc | null>(queryKey, {
          ...previousProfile,
          ...updatedData,
        });
      }

      return { previousProfile };
    },
    onError: (_error, _variables, context) => {
      // 실패 시 이전 프로필로 자동 롤백
      if (context?.previousProfile !== undefined) {
        queryClient.setQueryData(queryKey, context.previousProfile);
      }
    },
    onSettled: () => {
      // 서버 데이터와 최종 일치 동기화
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
