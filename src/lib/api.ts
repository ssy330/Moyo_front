// src/lib/api.ts
import axios from "axios";

// Vite 환경변수에서 API base를 직접 읽어 옵니다. (예: http://localhost:8000/api/v1 또는 /api/v1)
const RAW_API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api/v1";

// 뒤 슬래시를 정리하여 일관된 baseURL을 만듭니다 (예: "http://host/api/v1" 또는 "/api/v1")
export const API_BASE = RAW_API_BASE.replace(/\/+$/u, "");

// API origin: 절대 URL이면 origin을, 상대경로(/api/v1)라면 브라우저의 location.origin을 사용합니다.
export const API_ORIGIN = (() => {
  try {
    // 절대 URL인 경우
    return new URL(API_BASE).origin;
  } catch {
    // 상대경로인 경우 (빌드 시 window가 없을 수 있음)
    if (typeof window !== "undefined" && window.location)
      return window.location.origin;
    return "";
  }
})();

// Rhymix(또는 다른 외부) 기본 URL
export const RHYMIX_BASE_URL =
  (import.meta.env.VITE_RHYMIX_BASE_URL as string | undefined) ?? "";

export const api = axios.create({ baseURL: API_BASE });

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

// 계정 탈퇴
export async function deleteMyAccount() {
  // 백엔드 라우터 prefix에 맞게 경로 조정해줘
  // 예: @router = APIRouter(prefix="/auth") 이면 "/auth/me"
  const res = await api.delete("/auth/me");
  return res.data; // 204라면 빈 문자열일 수도 있음
}

// 그룹 탈퇴
export async function leaveGroup(groupId: number) {
  const res = await api.delete(`/groups/${groupId}/leave`);
  return res.data;
}
