import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";

export function useDeletePost(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost, // { groupId, postId } 받는 함수라고 가정

    onSuccess: async () => {
      // 1) 콜백 먼저
      callbacks?.onSuccess?.();

      // 2) 게시글 리스트 쿼리 무효화 → 그룹별 무한 스크롤 다시 가져오게
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.post.list],
      });
    },

    onError: (error) => {
      callbacks?.onError?.(error as Error);
    },
  });
}
