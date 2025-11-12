import { signInWithOAuth } from "@/lib/supabase-api";
import { useMutation } from "@tanstack/react-query";

export function useSignInWithOAuth() {
  return useMutation({
    mutationFn: signInWithOAuth,
  });
}
