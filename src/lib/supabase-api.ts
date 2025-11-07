import type { Provider } from "@supabase/supabase-js";
import supabase from "./supabase";

export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });

  if (error) throw error;
  return data;
}
