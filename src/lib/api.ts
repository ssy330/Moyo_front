// src/lib/api.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

export const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── 기존 타입들 유지 ─────────────────────────────
export type IdentityMode = "realname" | "nickname";
export interface GroupCreatePayload {
  name: string;
  description: string;
  image_url?: string | null;
  requires_approval: boolean;
  identity_mode: IdentityMode;
}
export interface GroupResponse {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  requires_approval: boolean;
  identity_mode: IdentityMode;
  creator_id: number;
  created_at: string;
  updated_at: string;
}

/** (기존) JSON 전송 버전 — 필요 시 계속 사용 */
export async function createGroupJSON(
  payload: GroupCreatePayload,
): Promise<{ data: GroupResponse; location: string | null }> {
  const res = await api.post<GroupResponse>("/groups/", payload);
  const location = (res.headers["location"] ?? null) as string | null;
  return { data: res.data, location };
}

/** (신규) FormData 전송 버전 — 파일 업로드용 */
export async function createGroupMultipart(
  formData: FormData,
): Promise<{ data: GroupResponse; location: string | null }> {
  const res = await api.post<GroupResponse>("/groups/", formData, {
    // axios는 FormData면 Content-Type 자동 설정하지만, 명시해도 됨
    headers: { "Content-Type": "multipart/form-data" },
  });
  const location = (res.headers["location"] ?? null) as string | null;
  return { data: res.data, location };
}
