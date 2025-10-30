// src/lib/api.ts
import axios from "axios";
import supabase from "@/lib/supabase";
import type { Provider } from "@supabase/supabase-js";

const BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

export const api = axios.create({
  baseURL: BASE,
  // 필요하면 timeout 등 설정
  // timeout: 5000,
});

// 요청 인터셉터: 로컬 스토리지의 access_token을 자동으로 Authorization 헤더에 붙임
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // localStorage 접근 실패시 무시
  }
  return config;
});

// Supabase 소셜 로그인
export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });
  if (error) throw error;
  return data;
}
