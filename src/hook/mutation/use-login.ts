import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MSGS } from "@/utils/messages";
import type { AxiosError } from "axios";
import { setSession } from "@/features/sessionSlice";
import { useAppDispatch } from "../use-app-dispatch";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (form: { email: string; password: string }) => {
      const res = await api.post("/auth/login", form);
      const token = res.data.access_token;
      localStorage.setItem("token", token);

      // ✅ 토큰으로 유저 정보 요청
      const me = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Redux 상태 갱신
      dispatch(setSession(me.data));

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
