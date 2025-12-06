// src/hook/mutation/post/use-create-post-mutation.ts

import { createPostWithImages } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// WriteModal에서 넘기는 파라미터 형태랑 정확히 맞춰줌
export interface CreatePostParams {
  groupId: number;
  title: string;
  content: string;
  images: File[];
}

export function useCreatePost(callbacks: UseMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    // variables 타입을 명시적으로 CreatePostParams로 고정
    mutationFn: (variables: CreatePostParams) =>
      createPostWithImages(variables),

    async onSuccess(_data, variables) {
      // 콜백 먼저
      callbacks?.onSuccess?.();

      // ✅ 이 그룹의 피드만 새로고침
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.post.list, variables.groupId],
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
