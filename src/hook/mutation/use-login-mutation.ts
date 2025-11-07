import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmail } from "@/lib/email-api";
import { MSGS } from "@/utils/messages";

export function useSignInWithEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInWithEmail,
    onSuccess: () => {
      alert(MSGS.LOGIN_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
