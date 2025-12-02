import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupMultipart } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data, location } = await createGroupMultipart(formData);
      return { data, location };
    },
    onSuccess: async ({ data, location }) => {
      await queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      toast.success("모임이 생성되었어요!");

      let groupId: string | number | undefined = data?.id;
      if (location) {
        const m = location.match(/\/groups\/(\d+)$/);
        if (m) groupId = m[1];
      }

      if (groupId) navigate(`/groups/${groupId}`);
      else navigate(`/groups`);
    },
    //에러처리
    onError: (error) => {
      const err = error as AxiosError<{ detail?: string }>;
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      // 1) 중복 그룹 이름 (409)
      if (status === 409 || detail?.includes("이미 존재하는 그룹 이름")) {
        toast.warning("중복된 이름의 그룹이 존재합니다.");
        return;
      }

      // 2) 로그인 필요
      if (error?.message === "NO_TOKEN" || status === 401) {
        toast.error("로그인이 필요해요. 로그인 페이지로 이동합니다.");
        navigate("/login");
        return;
      }

      // 3) 그 외
      toast.error(`생성 실패: ${detail ?? err.message ?? "알 수 없는 오류"}`);
    },
  });
}
