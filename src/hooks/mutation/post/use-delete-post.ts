import { deleteImagesInPath } from "@/api/image";
import { deletePost } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePost(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    // 어떤 인자를 받을지는 호출하는 쪽에서 결정 (보통 postId 또는 { groupId, postId })
    mutationFn: deletePost,

    // deletePost가 무엇을 리턴하든 일단 any로 받고, 방어적으로 사용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: async (deletedPost: any) => {
      callbacks?.onSuccess?.();

      // 1) 이미지가 있었다면 스토리지에서 정리
      //    (예전 구조: `${author_id}/${id}` 경로 사용)
      if (
        deletedPost?.image_urls &&
        Array.isArray(deletedPost.image_urls) &&
        deletedPost.image_urls.length > 0 &&
        deletedPost?.author_id
      ) {
        await deleteImagesInPath(`${deletedPost.author_id}/${deletedPost.id}`);
      }

      // 2) 게시글 리스트 쿼리 무효화 → 각 그룹별 useInfinitePostsData가 다시 fetch
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.post.list],
      });

      // 3) 단건 조회 캐시 제거 (있다면)
      if (deletedPost?.id != null) {
        queryClient.removeQueries({
          queryKey: QUERY_KEYS.post.byId(deletedPost.id),
        });
      }
    },

    onError: (error) => {
      callbacks?.onError?.(error as Error);
    },
  });
}
