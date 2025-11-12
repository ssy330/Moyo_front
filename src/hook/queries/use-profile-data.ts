import { createProfile, fetchProfile } from "@/api/profile";
import { QUERY_KEYS } from "@/lib/constants";
import type { RootState } from "@/store/store";
import type { PostgrestError } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export function useProfileData(userId?: string) {
  const session = useSelector((state: RootState) => state.session.session);
  const isMine = !!session?.user?.id && userId === session.user.id;

  return useQuery({
    queryKey: userId ? QUERY_KEYS.profile.byId(userId) : [],
    queryFn: async () => {
      if (!userId) throw new Error("userId is required for fetching profile");

      try {
        const profile = await fetchProfile(userId!);
        return profile;
      } catch (error) {
        if (isMine && (error as PostgrestError).code === "PGRST116") {
          return await createProfile(userId);
        }
        throw error;
      }
    },
    enabled: !!userId,
  });
}
