// src/hook/mutations/use-login.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MSGS } from "@/utils/messages";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: { email: string; password: string }) => {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      return res.data;
    },
    onSuccess: () => {
      alert(MSGS.LOGIN_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["me"] }); // 로그인 후 사용자 정보 갱신
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail ?? MSGS.INVALID_CREDENTIALS;
      alert(msg);
    },
  });
}
