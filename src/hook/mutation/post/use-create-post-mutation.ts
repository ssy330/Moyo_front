// src/hook/mutation/post/use-create-post-mutation.ts

import { createPostWithImages } from "@/api/post";
import type { UseMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

// WriteModal에서 넘기는 파라미터 형태랑 정확히 맞춰줌
export interface CreatePostParams {
  groupId: number;
  title: string;
  content: string;
  images: File[];
}

export function useCreatePost(callbacks: UseMutationCallback) {
  return useMutation({
    // variables 타입을 명시적으로 CreatePostParams로 고정
    mutationFn: (variables: CreatePostParams) =>
      createPostWithImages(variables),

    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
