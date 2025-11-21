// src/hook/mutation/use-group-leave-mutation.ts
import { useLeaveGroup } from "@/hook/mutation/group-delete-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Options = {
  afterSuccess?: () => void; // 성공 후 추가로 하고 싶은 행동 (모달 닫기, 페이지 이동 등)
  confirmMessage?: string; // 확인창 문구 커스터마이징
};

export function useLeaveGroupWithConfirm(options?: Options) {
  const { mutate, isPending } = useLeaveGroup();
  const queryClient = useQueryClient();

  const handleLeaveGroup = (groupId: number) => {
    const message =
      options?.confirmMessage ?? "정말 이 그룹을 탈퇴하시겠습니까?";

    // 1) 확인창
    if (!confirm(message)) return;

    // 2) 실제 탈퇴 요청
    mutate(groupId, {
      // ✅ 성공 시
      onSuccess: async () => {
        // 토스트
        toast.success("그룹 탈퇴가 완료되었습니다.");

        // 내 그룹 목록 새로고침
        await queryClient.invalidateQueries({ queryKey: ["my-groups"] });

        // 추가 후처리 (있으면)
        if (options?.afterSuccess) {
          options.afterSuccess();
        }
      },

      // ❌ 실패 시
      onError: (error) => {
        console.error("그룹 탈퇴 실패:", error);
        toast.error("그룹 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      },
    });
  };

  return {
    handleLeaveGroup,
    isPending,
  };
}
