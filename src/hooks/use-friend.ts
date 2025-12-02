import { useQuery } from "@tanstack/react-query";
import { getMyFriendsApi, type Friend } from "@/lib/friend-api";

export function useMyFriends() {
  return useQuery<Friend[]>({
    queryKey: ["friends", "mine"],
    queryFn: getMyFriendsApi,
  });
}
