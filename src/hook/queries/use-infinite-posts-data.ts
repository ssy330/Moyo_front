// src/hook/queries/use-infinite-posts-data.ts

import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

// ✅ groupId는 필수
export function useInfinitePostsData(groupId: number) {
  return useInfiniteQuery({
    // 그룹별로 캐시 분리
    queryKey: [QUERY_KEYS.post.list, groupId],

    // 실제 백엔드 API 요청 (groupId 포함)
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const posts = await fetchPosts({ groupId, from, to });
      return posts;
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지가 PAGE_SIZE보다 작으면 다음 페이지 없음
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length; // pageParam: 0,1,2,...
    },
  });
}
