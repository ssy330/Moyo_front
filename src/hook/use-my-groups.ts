import { useQuery } from "@tanstack/react-query";

const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api/v1";

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

async function fetchMyGroups(): Promise<Group[]> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_BASE}/groups/my`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("로그인이 필요합니다.");
    }
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load groups: ${res.status} ${text}`);
  }

  return res.json();
}

export function useMyGroups() {
  return useQuery({
    queryKey: ["myGroups"],
    queryFn: fetchMyGroups,
    staleTime: 1000 * 60 * 2, // 2분 동안 캐시 유지
    retry: 1, // 실패 시 1번만 재시도
  });
}
