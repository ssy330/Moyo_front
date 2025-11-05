// src/hook/queries/use-user.ts
import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase";
import { api } from "@/lib/api";

export function useUserQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      // ✅ Supabase 로그인 상태 확인
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        const user = session.user;
        return {
          name: user.user_metadata?.name ?? "이름 없음",
          email: user.email ?? "이메일 없음",
          avatar: user.user_metadata?.avatar_url ?? null,
          provider: "supabase",
        };
      }

      // ✅ FastAPI 로그인 상태 확인
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("로그인되지 않음");

      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);

      return { ...res.data, provider: "fastapi" };
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱
  });
}
