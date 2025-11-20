import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailApi } from "@/lib/email-api";
import { MSGS } from "@/utils/messages";
import { toast } from "sonner";

export function useSignInWithEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInWithEmailApi,
    onSuccess: () => {
      toast(MSGS.LOGIN_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
