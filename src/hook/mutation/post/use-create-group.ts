import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupMultipart } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    onError: (e) => {
      if (e?.message === "NO_TOKEN") {
        alert("로그인이 필요해요. 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        alert(`생성 실패: ${e?.message ?? "알 수 없는 오류"}`);
      }
    },
  });
}
