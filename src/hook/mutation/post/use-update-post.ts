// src/hook/mutations/use-update-post.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/types";
import { toast } from "sonner";

export function useEditPost({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: Post) => void;
  onError?: (err: any) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    // 🔥 아직 백엔드 수정 API가 없으므로, 임시 에러 던지기
    mutationFn: async (_post: Partial<Post> & { id: number }) => {
      throw new Error("게시글 수정 API가 아직 구현되지 않았습니다.");
    },

    onSuccess: async (data) => {
      toast.success("게시물이 수정되었습니다!", { position: "top-center" });

      // ✅ posts 관련 쿼리 invalidate (피드 갱신)
      await queryClient.invalidateQueries({ queryKey: [ "posts" ] });

      onSuccess?.(data);
    },

    onError: (err) => {
      // 여기로 항상 들어오게 될 거야 (위에서 에러 던져서)
      toast.error("게시물 수정 기능이 아직 준비되지 않았어요.", {
        position: "top-center",
      });
      onError?.(err);
    },
  });
}
