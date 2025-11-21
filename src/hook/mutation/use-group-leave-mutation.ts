// src/hook/mutation/use-group-leave-mutation.ts
import { useLeaveGroup } from "@/hook/mutation/group-delete-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { openAlert } from "@/features/alertSlice";

type Options = {
  afterSuccess?: () => void; // 성공 후 추가 동작 (모달 닫기, 페이지 이동 등)
  confirmMessage?: string; // 설명 문구 커스터마이징
};

export function useLeaveGroupWithConfirm(options?: Options) {
  const { mutate, isPending } = useLeaveGroup();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleLeaveGroup = (groupId: number) => {
    const message =
      options?.confirmMessage ?? "정말 이 그룹을 탈퇴하시겠습니까?";

    // ✅ 여기서 더 이상 window.confirm 사용 X
    // 대신 AlertModal을 열도록 alertSlice에 요청
    dispatch(
      openAlert({
        title: "그룹 탈퇴",
        description: message,
        // 사용자가 AlertModal에서 "확인" 눌렀을 때 실행될 함수
        onPositive: () => {
          mutate(groupId, {
            onSuccess: async () => {
              toast.success("그룹 탈퇴가 완료되었습니다.");

              // 내 그룹 목록 새로고침
              await queryClient.invalidateQueries({ queryKey: ["myGroups"] });
              await queryClient.invalidateQueries({
                queryKey: ["myChatRooms"],
              });

              // 추가 후처리 (옵션)
              if (options?.afterSuccess) {
                options.afterSuccess();
              }
            },
            onError: (error) => {
              console.error("그룹 탈퇴 실패:", error);
              toast.error(
                "그룹 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.",
              );
            },
          });
        },
        // "취소" 눌렀을 때
        onNegative: () => {
          // 아무것도 안 해도 되고, 나중에 필요하면 여기도 처리 가능
        },
      }),
    );
  };

  return {
    handleLeaveGroup,
    isPending,
  };
}
