import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api-link";

export type Group = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  requires_approval: boolean;
  identity_mode: string;
  creator_id: number;
  created_at: string;
  updated_at: string;
  member_count?: number;
};

export class AuthError extends Error {
  code = "UNAUTHORIZED" as const;
  constructor(message = "로그인이 필요합니다.") {
    super(message);
    this.name = "AuthError";
  }
}

async function fetchMyGroups(): Promise<Group[]> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/groups/my`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    // 🔹 로그인 관련 에러
    if (res.status === 401 || res.status === 403) {
      // 토큰은 더 이상 의미 없으니까 지워버리기
      localStorage.removeItem("access_token");
      throw new AuthError("세션이 만료되었습니다. 다시 로그인해 주세요.");
    }

    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load groups: ${res.status} ${text}`);
  }

  return res.json();
}

export function useMyGroups(enabled = true) {
  return useQuery({
    queryKey: ["myGroups"],
    queryFn: fetchMyGroups,
    staleTime: 1000 * 60 * 2, // 2분 동안 캐시 유지
    retry: false, // 🔥 세션 만료 같은 에러에서 재시도 안 함
    enabled,
  });
}
