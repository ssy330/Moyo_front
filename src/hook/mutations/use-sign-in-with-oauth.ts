import { signInWithOAuth } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useSignInWithOAuth() {
  return useMutation({
    mutationFn: signInWithOAuth,
  });
}
