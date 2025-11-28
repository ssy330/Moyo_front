// src/lib/friend-api.ts
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
  group?: FriendRequestGroup | null;
}

// 여기부터 "친구 목록" 타입
export interface FriendListGroup {
  id: number;
  name: string;
  image_url?: string | null;
}

export interface FriendUser {
  id: number;
  email: string;
  name: string;
  nickname: string;
  profile_image_url: string | null;
}

export interface Friend {
  id: number; // friend_request id 그대로 내려온다고 가정
  created_at: string;
  friend: FriendUser; // "나의 친구" 유저 정보
  group?: FriendListGroup | null;
}

export interface OutgoingFriendRequest {
  id: number;
  status: FriendRequestStatus;
  group_id: number | null;
  created_at: string;
  receiver: FriendUser;
  group?: FriendListGroup | null;
}

// ─────────────────────────────
// 기존 요청 관련 API
// ─────────────────────────────
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

// 친구 목록 API (백엔드: GET /friend-requests/friends)
export async function getMyFriendsApi() {
  const res = await api.get<Friend[]>("/friend-requests/friends");
  return res.data;
}

export async function getOutgoingFriendRequestsApi() {
  const res = await api.get<OutgoingFriendRequest[]>(
    "/friend-requests/outgoing",
  );
  return res.data;
}
