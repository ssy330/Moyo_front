import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostEntity } from "@/types";
import { toast } from "sonner";
import { updatePost } from "@/api/post";

export function useEditPost({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: PostEntity) => void;
  onError?: (err: any) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<PostEntity> & { id: number }) => {
      // ✅ Supabase update 호출
      const updated = await updatePost(post);
      return updated;
    },
    onSuccess: async (data) => {
      toast.success("게시물이 수정되었습니다!", { position: "top-center" });

      // ✅ posts 관련 쿼리 invalidate (피드 갱신)
      await queryClient.invalidateQueries({ queryKey: ["posts"] });

      onSuccess?.(data);
    },
    onError: (err) => {
      toast.error("게시물 수정에 실패했습니다.", { position: "top-center" });
      onError?.(err);
    },
  });
}
