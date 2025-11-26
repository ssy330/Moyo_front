import { api } from "@/lib/api";

export type FriendRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELED";

export interface FriendRequesterUser {
  id: number;
  email: string;
  name: string;
  nickname: string;
  profile_image_url: string | null;
}

export interface FriendRequestGroup {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
}

export interface FriendRequest {
  id: number;
  status: FriendRequestStatus;
  group_id: number | null;
  created_at: string;
  requester: FriendRequesterUser;
  group?: FriendRequestGroup | null; // 🔥 여기 추가
}

export async function sendFriendRequestApi(params: {
  receiver_id: number;
  group_id?: number;
}) {
  const res = await api.post<FriendRequest>("/friend-requests", params);
  return res.data;
}

export async function getIncomingFriendRequestsApi() {
  const res = await api.get<FriendRequest[]>("/friend-requests/incoming");
  return res.data;
}

export async function acceptFriendRequestApi(requestId: number) {
  const res = await api.post<FriendRequest>(
    `/friend-requests/${requestId}/accept`,
  );
  return res.data;
}

export async function rejectFriendRequestApi(requestId: number) {
  const res = await api.post<FriendRequest>(
    `/friend-requests/${requestId}/reject`,
  );
  return res.data;
}
