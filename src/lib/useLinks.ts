"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LinkItem } from "../types/mylink";
import {
  getFirebaseLinks,
  addFirebaseLink,
  updateFirebaseLink,
  deleteFirebaseLink,
  incrementFirebaseLinkClick,
} from "./firebaseLinks";

export const linksQueryKeys = {
  all: ["links"] as const,
  user: (userId?: string) => ["links", userId || "anonymous"] as const,
};

/**
 * 특정 유저의 Firestore 링크 목록을 조회하는 쿼리 훅
 */
export function useLinksQuery(userId?: string) {
  return useQuery({
    queryKey: linksQueryKeys.user(userId),
    queryFn: () => {
      if (!userId) return [];
      return getFirebaseLinks(userId);
    },
    enabled: !!userId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

/**
 * 새 링크 추가 Mutation (낙관적 업데이트 및 롤백 지원)
 */
export function useAddLinkMutation(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = linksQueryKeys.user(userId);

  return useMutation({
    mutationFn: (newLinkData: Omit<LinkItem, "id" | "click_count">) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return addFirebaseLink(userId, newLinkData);
    },
    onMutate: async (newLinkData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 캐시 스냅샷 저장
      const previousLinks = queryClient.getQueryData<LinkItem[]>(queryKey) || [];

      // 임시 ID와 함께 즉시 캐시 추가 (0ms 낙관적 업데이트)
      const optimisticLink: LinkItem = {
        id: `optimistic-${Date.now()}`,
        title: newLinkData.title,
        subtitle: newLinkData.subtitle,
        url: newLinkData.url,
        icon: newLinkData.icon || "🔗",
        badge: newLinkData.badge,
        is_active: newLinkData.is_active ?? true,
        sort_order: newLinkData.sort_order ?? 1,
        click_count: 0,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<LinkItem[]>(queryKey, [optimisticLink, ...previousLinks]);

      return { previousLinks };
    },
    onError: (_error, _variables, context) => {
      // 에러 발생 시 이전 상태로 자동 롤백
      if (context?.previousLinks) {
        queryClient.setQueryData(queryKey, context.previousLinks);
      }
    },
    onSettled: () => {
      // 서버 데이터와 최종 일치 동기화
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * 링크 수정 Mutation (낙관적 업데이트 및 롤백 지원)
 */
export function useUpdateLinkMutation(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = linksQueryKeys.user(userId);

  return useMutation({
    mutationFn: ({
      linkId,
      updatedFields,
    }: {
      linkId: string;
      updatedFields: Partial<Omit<LinkItem, "id">>;
    }) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return updateFirebaseLink(userId, linkId, updatedFields);
    },
    onMutate: async ({ linkId, updatedFields }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousLinks = queryClient.getQueryData<LinkItem[]>(queryKey) || [];

      // 대상 링크 즉각 수정 반영
      queryClient.setQueryData<LinkItem[]>(
        queryKey,
        previousLinks.map((item) =>
          item.id === linkId ? { ...item, ...updatedFields } : item
        )
      );

      return { previousLinks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(queryKey, context.previousLinks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * 링크 삭제 Mutation (낙관적 업데이트 및 롤백 지원)
 */
export function useDeleteLinkMutation(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = linksQueryKeys.user(userId);

  return useMutation({
    mutationFn: (linkId: string) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return deleteFirebaseLink(userId, linkId);
    },
    onMutate: async (linkId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousLinks = queryClient.getQueryData<LinkItem[]>(queryKey) || [];

      // 대상 링크 즉시 제거 반영
      queryClient.setQueryData<LinkItem[]>(
        queryKey,
        previousLinks.filter((item) => item.id !== linkId)
      );

      return { previousLinks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(queryKey, context.previousLinks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * 링크 클릭 수 증가 Mutation (낙관적 카운트 업)
 */
export function useClickLinkMutation(userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = linksQueryKeys.user(userId);

  return useMutation({
    mutationFn: (linkId: string) => {
      if (!userId) return Promise.resolve();
      return incrementFirebaseLinkClick(userId, linkId);
    },
    onMutate: async (linkId) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey });
      const previousLinks = queryClient.getQueryData<LinkItem[]>(queryKey) || [];

      queryClient.setQueryData<LinkItem[]>(
        queryKey,
        previousLinks.map((item) =>
          item.id === linkId
            ? { ...item, click_count: (item.click_count || 0) + 1 }
            : item
        )
      );

      return { previousLinks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(queryKey, context.previousLinks);
      }
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
