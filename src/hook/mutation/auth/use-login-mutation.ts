import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailApi } from "@/lib/email-api";
import { MSGS } from "@/utils/messages";

export function useSignInWithEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInWithEmailApi,
    onSuccess: () => {
      alert(MSGS.LOGIN_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
