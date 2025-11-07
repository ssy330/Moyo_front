import type { Post } from "@/types";

export default function PostItem(post: Post) {
  return <div>{post.content}</div>;
}
