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
    }: {
      email: string;
      name: string;
      nickname: string;
      password: string;
    }) => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, nickname, password }),
      });
      console.log(res);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Signup failed");
      }
      return res.json();
    },
  });
