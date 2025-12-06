// src/hooks/mutation/post/use-update-post.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/types";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import { updatePost } from "@/api/post";

interface EditPostInput {
  id: number;
  groupId: number;
  content: string;
  image_urls: string[];
}

export function useEditPost({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: Post) => void;
  onError?: (err: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, EditPostInput>({
    mutationFn: ({ id, groupId, content, image_urls }) =>
      updatePost({ groupId, postId: id, content, image_urls }),

    async onSuccess(data, variables) {
      toast.success("게시물이 수정되었습니다!", { position: "top-center" });

      // ✅ 수정된 게시글이 있는 그룹 피드 invalidate
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.post.list, variables.groupId],
      });

      onSuccess?.(data);
    },

    onError(err) {
      toast.error("게시물 수정에 실패했습니다.", {
        position: "top-center",
      });
      onError?.(err);
    },
  });
}
