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
// 2) 게시글 생성
// ─────────────────────────────

interface CreatePostBody {
  title: string;
  content: string;
  image_urls: string[];
}

export async function createPost({
  groupId,
  title,
  content,
  image_urls,
}: {
  groupId: number;
} & CreatePostBody) {
  const res = await api.post(`/groups/${groupId}/posts`, {
    title,
    content,
    image_urls,
  });
  return res.data;
}

// ─────────────────────────────
// 3) 이미지까지 포함한 게시글 생성
//    (자체 백엔드 이미지 업로드 + 게시글 생성)
// ─────────────────────────────

export interface CreatePostWithImagesParams {
  groupId: number;
  title: string;
  content: string;
  images: File[];
}

export async function createPostWithImages({
  groupId,
  title,
  content,
  images,
}: CreatePostWithImagesParams) {
  // 1) 모든 이미지 업로드 → URL 배열 만들기
  const uploadedUrls: string[] = [];
  for (const file of images) {
    const url = await uploadImage({ file }); // 기존에 쓰던 uploadImage 재사용
    uploadedUrls.push(url);
  }

  // 2) 백엔드에 image_urls만 보냄 (썸네일 X)
  const post = await createPost({
    groupId,
    title,
    content,
    image_urls: uploadedUrls,
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

// ─────────────────────────────
// 5) 게시글 수정
// ─────────────────────────────

interface UpdatePostBody {
  title?: string;
  content?: string;
  image_urls?: string[];
}

export interface UpdatePostParams extends UpdatePostBody {
  groupId: number;
  postId: number;
}

/**
 * PATCH /groups/{group_id}/posts/{post_id}
 * 수정된 Post 리턴
 */
export async function updatePost({
  groupId,
  postId,
  title,
  content,
  image_urls,
}: UpdatePostParams) {
  const res = await api.patch<Post>(`/groups/${groupId}/posts/${postId}`, {
    title,
    content,
    image_urls,
  });

  return res.data;
}
