// 백엔드 API
export const API_URL = import.meta.env.VITE_API_BASE ?? "/api/v1";

export const API_ORIGIN = new URL(API_URL).origin;
