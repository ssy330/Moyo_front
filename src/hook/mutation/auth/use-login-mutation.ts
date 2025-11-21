import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailApi } from "@/lib/email-api";
import { setSession } from "@/features/sessionSlice";
import { useDispatch } from "react-redux";

export function useSignInWithEmail() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: signInWithEmailApi,
    onSuccess: ({ me }) => {
      const sessionUser = {
        user_id: me.id,
        email: me.email,
        name: me.name,
        nickname: me.nickname,
      };

      dispatch(
        setSession({
          user: sessionUser,
          source: "fastapi",
        }),
      );

      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
