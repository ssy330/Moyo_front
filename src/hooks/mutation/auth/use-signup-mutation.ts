// src/hook/mutations/useAuthMutations.ts
import { useMutation } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE;

export const useSendCode = () =>
  useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(`${API_BASE}/auth/email/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Too many requests");
      }
      return res.json();
    },
  });

export const useVerifyCode = () =>
  useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const res = await fetch(`${API_BASE}/auth/email/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Invalid or expired code");
      }
      return res.json();
    },
  });

export const useSignup = () =>
  useMutation({
    mutationFn: async ({
      email,
      name,
      nickname,
      password,
      profileImage,
    }: {
      email: string;
      name: string;
      nickname: string;
      password: string;
      profileImage?: File | null;
    }) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("nickname", nickname);
      formData.append("password", password);

      if (profileImage) {
        formData.append("profile_image", profileImage); // 🔴 백엔드 필드 이름이랑 맞추기
      }

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        body: formData, // ❗ headers에 Content-Type 설정 X (브라우저가 자동으로 boundary 붙임)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Signup failed");
      }
      return res.json();
    },
  });
