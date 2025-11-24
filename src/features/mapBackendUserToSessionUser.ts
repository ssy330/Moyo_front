// src/features/mapBackendUserToSessionUser.ts
import type { SessionUser } from "./sessionSlice";
import { API_URL } from "@/lib/api-link"; // 너가 쓰는 곳에 맞게 import (api.ts, api-link.ts 등)

const API_ORIGIN = new URL(API_URL).origin;

export interface BackendUser {
  id: number;
  email?: string | null;
  name?: string | null;
  nickname?: string | null;
  profile_image_url?: string | null;
}

export function mapBackendUserToSessionUser(u: BackendUser): SessionUser {
  const raw = u?.profile_image_url ?? null;

  const profileImageUrl =
    raw == null ? null : raw.startsWith("http") ? raw : `${API_ORIGIN}${raw}`; // "/static/..." -> "http://localhost:8000/static/..."

  return {
    id: u.id,
    email: u.email ?? undefined,
    name: u.name ?? undefined,
    nickname: u.nickname ?? undefined,
    profile_image_url: profileImageUrl,
  };
}
