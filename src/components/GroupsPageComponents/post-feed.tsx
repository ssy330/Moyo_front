// src/components/GroupsPageComponents/post-feed.tsx

import Fallback from "../fallback";
import Loader from "../loader";
import PostItem from "./post-item";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useInfinitePostsData } from "@/hook/queries/use-infinite-posts-data";

interface PostFeedProps {
  groupId: number;
}

export default function PostFeed({ groupId }: PostFeedProps) {
  const {
    data,
    error,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfinitePostsData(groupId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (error) {
    console.error("PostFeed error:", error);
    return <Fallback />;
  }

  if (isPending && !data) return <Loader />;

  return (
    <div className="flex flex-col gap-10">
      {data?.pages.map((page, pageIndex) =>
        page.map((post) => (
          <PostItem key={`${pageIndex}-${post.id}`} {...post} />
        )),
      )}
      {isFetchingNextPage && <Loader />}
      <div ref={ref} />
    </div>
  );
}
