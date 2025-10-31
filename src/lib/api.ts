// src/lib/api.ts
import axios from "axios";

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
  } catch (e: unknown) {
    // localStorage 접근 실패시 무시
    if (e instanceof Error) {
      console.warn("토큰 헤더 설정 중 오류 발생:", e.message);
    }
  }
  return config;
});
