// src/hook/queries/use-infinite-posts-data.ts

import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 5;

// groupId는 UI 캐시 분리용으로만 사용하고
// API 요청에는 전달하지 않는다 (지금 post 테이블에 group_id 없음)
export function useInfinitePostsData(groupId?: number) {
  return useInfiniteQuery({
    // 그룹별로 캐시를 분리함 (각 그룹 페이지마다 게시글 캐시 따로)
    queryKey: [QUERY_KEYS.post.list, groupId ?? "all"],

    // 실제 Supabase 요청에는 groupId를 사용하지 않음
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Supabase에는 from/to만 전달
      const posts = await fetchPosts({ from, to });
      return posts;
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
  });
}
