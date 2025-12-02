// src/hook/queries/use-post-data.ts
import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

interface UsePostDataParams {
  groupId: number;
  from: number;
  to: number;
}

export function usePostData(params: UsePostDataParams) {
  return useQuery({
    // groupId, from, to까지 queryKey에 포함해서 캐시 분리
    queryKey: [...QUERY_KEYS.post.list, params.groupId, params.from, params.to],
    queryFn: () => fetchPosts(params),
  });
}
