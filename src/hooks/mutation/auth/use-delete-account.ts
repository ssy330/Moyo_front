import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyAccount } from "@/lib/api";
import { useDispatch } from "react-redux";
import { clearSession } from "@/features/sessionSlice";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { toast } from "sonner";

type DeleteAccountError = AxiosError<{ detail?: string }>;

export function useDeleteAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<void, DeleteAccountError, void>({
    mutationKey: ["delete-account"],
    mutationFn: deleteMyAccount,
    onSuccess: async () => {
      await queryClient.clear();
      localStorage.removeItem("access_token");
      dispatch(clearSession());
      toast.success("회원 탈퇴가 완료되었습니다.");
      navigate("/login");
    },
    onError: (err) => {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 400) {
        toast.error(
          detail ??
            "방장으로 있는 그룹이 있어 탈퇴할 수 없습니다. 그룹을 먼저 정리한 뒤 다시 시도해 주세요.",
        );
      } else if (status === 401) {
        toast.error("로그인이 만료되었습니다. 다시 로그인 후 시도해주세요.");
      } else if (status === 404) {
        toast.error(
          "사용자를 찾을 수 없습니다. 이미 탈퇴된 계정일 수 있습니다.",
        );
      } else {
        toast.error(
          "회원 탈퇴 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    },
  });
}
