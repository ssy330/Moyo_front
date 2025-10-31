// src/hook/mutations/use-login.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MSGS } from "@/utils/messages";
import type { AxiosError } from "axios";

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
    onError: (error: unknown) => {
      // ✅ 타입 좁히기
      const axiosError = error as AxiosError<{ detail?: string }>;
      const msg = axiosError.response?.data?.detail ?? MSGS.INVALID_CREDENTIALS;
      alert(msg);
    },
  });
}
