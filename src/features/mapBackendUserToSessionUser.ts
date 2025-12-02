// src/features/mapBackendUserToSessionUser.ts
import type { SessionUser } from "./sessionSlice";
import { API_ORIGIN } from "@/lib/api";

export interface BackendUser {
  id: number;
  email?: string | null;
  name?: string | null;
  nickname?: string | null;
  profile_image_url?: string | null;
}

function normalizeProfileImageUrl(raw?: string | null): string | null {
  if (!raw) return null;

  let url = raw.trim();
  if (!url) return null;

  // 1) 이미 절대 URL인 경우
  if (/^https?:\/\//.test(url)) {
    return url;
  }

  // 2) 이미 origin이 앞에 붙어 있는 경우 (중복 방지)
  if (url.startsWith(API_ORIGIN)) {
    return url;
  }

  // 3) "static/..." 형태라면 앞에 슬래시 보정
  if (!url.startsWith("/")) {
    url = `/${url}`;
  }

  // 최종: http://localhost:8000 + /static/...
  return `${API_ORIGIN}${url}`;
}

export function mapBackendUserToSessionUser(u: BackendUser): SessionUser {
  return {
    id: u.id,
    email: u.email ?? undefined,
    name: u.name ?? undefined,
    nickname: u.nickname ?? undefined,
    profile_image_url: normalizeProfileImageUrl(u.profile_image_url),
  };
}
