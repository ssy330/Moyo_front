import { useLeaveGroup } from "@/hook/mutation/group-delete-mutation";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { closeModal } from "@/features/modalSlice";
import { openAlert } from "@/features/alertSlice";

export function useLeaveGroupWithConfirm(options?: {
  closeOnSuccess?: boolean;
}) {
  const { mutate, isPending } = useLeaveGroup();
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleLeaveGroup = (groupId: number) => {
    // ✅ 여기서 window.confirm 대신 Alert 열기
    dispatch(
      openAlert({
        title: "그룹 탈퇴",
        description: "정말 이 그룹을 탈퇴하시겠습니까?",
        // 취소 눌렀을 때 (필요 없으면 비워둬도 됨)
        onNegative: () => {
          // 아무 것도 안 해도 됨
        },
        // 확인 눌렀을 때 실제 탈퇴 로직 수행
        onPositive: () => {
          mutate(groupId, {
            onSuccess: async () => {
              await queryClient.invalidateQueries({ queryKey: ["my-groups"] });
              await new Promise((r) => setTimeout(r, 300));

              if (options?.closeOnSuccess) {
                dispatch(closeModal());
              }

              nav("/", { replace: true });
            },
            onError: (error) => {
              console.error("그룹 탈퇴 실패:", error);
              // 필요하면 여기서도 alert 한 번 더 띄울 수 있음
            },
          });
        },
      }),
    );
  };

  return { handleLeaveGroup, isPending };
}
