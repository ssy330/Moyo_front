// src/types.ts
import type { Database } from "./database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];
export type ProfileEntity = Database["public"]["Tables"]["profile"]["Row"];

// 🧑‍💻 백엔드 AuthorInfo에 맞춘 타입
export interface Author {
  id: number;
  name: string;
  profile_image_url?: string | null;
}

// 📝 백엔드 PostSummaryOut에 맞춘 UI용 Post 타입
export interface Post {
  id: number;
  group_id: number;
  title: string;
  content: string;
  author: Author;
  created_at: string; // FastAPI가 ISO 문자열로 줄 테니까 string으로 두는 게 편함
  like_count: number;
  comment_count: number;
  is_liked: boolean;

  // Supabase 시절에 쓰던 이미지 필드도 혹시 모를 사용처 때문에 남겨두기 (옵션)
  image_urls?: string[] | null;
}

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
