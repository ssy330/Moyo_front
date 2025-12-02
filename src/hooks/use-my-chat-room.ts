import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api-link";

export interface RoomGroup {
  id: number;
  name: string;
  image_url?: string | null;
}

export interface Room {
  id: number;
  name: string;
  created_at: string;
  group_id?: number;
  group?: RoomGroup | null;
}

async function fetchMyGroupRooms(): Promise<Room[]> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/rooms/my-group`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    // 필요하면 여기서 401 처리, AuthError 던지기 등도 가능
    const text = await res.text().catch(() => "");
    throw new Error(`방 목록 불러오기 실패: ${res.status} ${text}`);
  }

  return res.json();
}

export function useMyChatRooms() {
  return useQuery({
    queryKey: ["myChatRooms"],
    queryFn: fetchMyGroupRooms,
    staleTime: 1000 * 60, // 1분 캐시 (원하는 대로 조절 가능)
    retry: 1,
    refetchOnMount: "always",
  });
}
