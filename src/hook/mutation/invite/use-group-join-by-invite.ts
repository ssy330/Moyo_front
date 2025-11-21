import { joinGroupByInvite } from "@/services/groupService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useGroupJoinByInvite(onClose?: () => void) {
  const queryClient = useQueryClient();
  const nav = useNavigate();

  return useMutation({
    mutationKey: ["inviteJoin"],
    mutationFn: (code: string) => joinGroupByInvite(code),
    onSuccess: async (data) => {
      const { group } = data;

      await queryClient.invalidateQueries({ queryKey: ["myGroups"] });

      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.success(`"${group.name}" 그룹에 참가했어요!`);

      if (onClose) onClose();
      nav(`/groups/${group.id}`);
    },
    onError: (error) => {
      let message = "초대 코드로 그룹 참가에 실패했어요.";

      if (axios.isAxiosError(error)) {
        const reason = error.response?.data?.detail;

        switch (reason) {
          case "NOT_FOUND":
            message = "존재하지 않는 초대 코드입니다.";
            break;
          case "EXPIRED":
            message = "만료된 초대 코드입니다.";
            break;
          case "EXHAUSTED":
            message = "사용 횟수가 모두 소진된 초대 코드입니다.";
            break;
          case "REVOKED":
            message = "관리자에 의해 취소된 초대 코드입니다.";
            break;
          case "INVALID_PURPOSE":
            message = "이 초대 코드는 그룹 참여용이 아닙니다.";
            break;
          case "BAD_PAYLOAD":
          case "GROUP_ID_MISSING":
          case "GROUP_NOT_FOUND":
            message = "이 초대 코드에 연결된 그룹 정보를 찾을 수 없습니다.";
            break;
        }
      }

      toast.error(message);
    },
  });
}
