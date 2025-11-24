import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailApi } from "@/lib/email-api";
import { setSession } from "@/features/sessionSlice";
import { useDispatch } from "react-redux";

export function useSignInWithEmail() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: signInWithEmailApi,
    onSuccess: (data) => {
      const { me, auth } = data;

      // 1) 토큰 저장
      if (auth?.access_token) {
        localStorage.setItem("access_token", auth.access_token);
      }

      // 2) 세션 유저 구성 (필요하면 프로필 이미지 등도 같이)
      const sessionUser = {
        id: me.id,
        email: me.email,
        name: me.name,
        nickname: me.nickname,
        profile_image_url: me.profile_image_url ?? null,
      };

      dispatch(
        setSession({
          user: sessionUser,
          source: "fastapi",
        }),
      );

      // 3) me 쿼리 invalidate (혹시 쓰고 있으면)
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
