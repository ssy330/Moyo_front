// src/components/GroupsPageComponents/post-item.tsx

import { HeartIcon, MessageCircle } from "lucide-react";
import type { Post } from "@/types";
import defaultAvatar from "@/assets/default-avatar.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { formatTimeAgo } from "@/lib/time";
import EditPostItemButton from "./edit-post-item-button";
import DeletePostButton from "./delete-post-item-button";

export default function PostItem(post: Post) {
  const authorName = post.author.name;
  const avatarSrc = post.author.profile_image_url ?? defaultAvatar;

  return (
    <div className="flex flex-col gap-4 border-b pb-8">
      {/* 1. 유저 정보, 수정/삭제 버튼 */}
      <div className="flex justify-between">
        {/* 1-1. 유저 정보 */}
        <div className="flex items-start gap-4">
          <img
            src={avatarSrc}
            alt={`${authorName}의 프로필 이미지`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="font-bold hover:underline">{authorName}</div>
            <div className="text-muted-foreground text-sm">
              {formatTimeAgo(post.created_at)}
            </div>
          </div>
        </div>

        {/* 1-2. 수정/삭제 버튼 */}
        <div className="text-muted-foreground flex text-sm">
          <EditPostItemButton {...post} />
          <DeletePostButton id={post.id} />
        </div>
      </div>

      {/* 2. 컨텐츠, 이미지 캐러셀 */}
      <div className="flex cursor-pointer flex-col gap-5">
        {/* 2-1. 컨텐츠 */}
        <div className="line-clamp-2 wrap-break-word whitespace-pre-wrap">
          {post.content}
        </div>

        {/* 2-2. 이미지 캐러셀 (image_urls가 있을 때만 렌더링) */}
        {post.image_urls && post.image_urls.length > 0 && (
          <Carousel>
            <CarouselContent>
              {post.image_urls.map((url, index) => (
                <CarouselItem className="basis-3/5" key={index}>
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={url}
                      className="h-full max-h-[350px] w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* 3. 좋아요, 댓글 버튼 */}
      <div className="flex gap-2">
        {/* 3-1. 좋아요 버튼 */}
        <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm">
          <HeartIcon className="h-4 w-4" />
          <span>{post.like_count}</span>
        </div>

        {/* 3-2. 댓글 버튼 */}
        <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm">
          <MessageCircle className="h-4 w-4" />
          <span>댓글 {post.comment_count}개</span>
        </div>
      </div>
    </div>
  );
}
