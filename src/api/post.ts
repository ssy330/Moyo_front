// src/api/post.ts

import { api } from "@/lib/api";
import { uploadImage } from "./image";
import type { Post } from "@/types";

// ─────────────────────────────
// 1) 게시글 목록 조회 (무한 스크롤용)
// ─────────────────────────────

interface FetchPostsParams {
  groupId: number;
  from: number;
  to: number;
}

/**
 * GET /groups/{group_id}/posts?from_=&to=
 */
export async function fetchPosts({ groupId, from, to }: FetchPostsParams) {
  const res = await api.get<Post[]>(`/groups/${groupId}/posts`, {
    params: {
      from_: from, // 🔥 백엔드 파라미터 이름: from_
      to,
    },
  });

  return res.data; // Post[] (PostSummaryOut과 동일 구조)
}

// ─────────────────────────────
// 2) 게시글 생성 (thumbnail_url 포함)
// ─────────────────────────────

interface CreatePostParams {
  groupId: number;
  title: string;
  content: string;
  thumbnailUrl?: string | null;
}

/**
 * POST /groups/{group_id}/posts
 * body: { title, content, thumbnail_url? }
 */
export async function createPost({
  groupId,
  title,
  content,
  thumbnailUrl = null,
}: CreatePostParams) {
  const res = await api.post<Post>(`/groups/${groupId}/posts`, {
    title,
    content,
    thumbnail_url: thumbnailUrl, // 🔥 백엔드 PostCreate.thumbnail_url 필드랑 맞춤
  });

  return res.data; // PostDetailOut과 거의 동일 (comments 제외)
}

// ─────────────────────────────
// 3) 이미지까지 포함한 게시글 생성
//    (자체 백엔드 이미지 업로드 + 게시글 생성)
// ─────────────────────────────

interface CreatePostWithImagesParams {
  groupId: number;
  title: string;
  content: string;
  images: File[]; // 이제 userId나 filePath 필요 없음
}

export async function createPostWithImages({
  groupId,
  title,
  content,
  images,
}: CreatePostWithImagesParams) {
  let thumbnailUrl: string | null = null;

  // 첫 번째 이미지를 썸네일로 사용
  if (images.length > 0) {
    thumbnailUrl = await uploadImage({
      file: images[0],
    });
  }

  const post = await createPost({
    groupId,
    title,
    content,
    thumbnailUrl,
  });

  return post;
}

// ─────────────────────────────
// 4) 게시글 삭제
// ─────────────────────────────

interface DeletePostParams {
  groupId: number;
  postId: number;
}

/**
 * DELETE /groups/{group_id}/posts/{post_id}
 * 204 No Content
 */
export async function deletePost({ groupId, postId }: DeletePostParams) {
  await api.delete(`/groups/${groupId}/posts/${postId}`);
}
