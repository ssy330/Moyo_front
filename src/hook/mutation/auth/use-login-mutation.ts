import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailApi } from "@/lib/email-api";
import { setSession } from "@/features/sessionSlice";
import { useDispatch } from "react-redux";
import { mapBackendUserToSessionUser } from "@/features/mapBackendUserToSessionUser";

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

      // 2) 세션 유저 구성: 항상 map 함수 거쳐서 URL 정제
      const sessionUser = mapBackendUserToSessionUser(me);

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
