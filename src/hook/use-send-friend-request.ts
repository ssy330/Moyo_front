// src/hook/friend/use-friend-requests.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  sendFriendRequestApi,
  getIncomingFriendRequestsApi,
  acceptFriendRequestApi,
  rejectFriendRequestApi,
  type FriendRequest,
  type OutgoingFriendRequest,
  getOutgoingFriendRequestsApi,
} from "@/lib/friend-api";
import { toast } from "sonner";

export function useSendFriendRequest() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: sendFriendRequestApi,
    onSuccess: () => {
      toast.success("친구 요청을 보냈습니다.");
      // 필요하면 나중에 친구 목록 같은 것도 invalidate
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail ?? "친구 요청에 실패했습니다.";
      toast.error(msg);
    },
  });
}

export function useIncomingFriendRequests() {
  return useQuery<FriendRequest[]>({
    queryKey: ["friend-requests", "incoming"],
    queryFn: getIncomingFriendRequestsApi,
  });
}

export function useAcceptFriendRequest() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: acceptFriendRequestApi,
    onSuccess: () => {
      toast.success("친구 요청을 수락했습니다.");
      qc.invalidateQueries({ queryKey: ["friend-requests", "incoming"] });
    },
    onError: () => {
      toast.error("친구 요청 수락에 실패했습니다.");
    },
  });
}

export function useRejectFriendRequest() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: rejectFriendRequestApi,
    onSuccess: () => {
      toast.success("친구 요청을 거절했습니다.");
      qc.invalidateQueries({ queryKey: ["friend-requests", "incoming"] });
    },
    onError: () => {
      toast.error("친구 요청 거절에 실패했습니다.");
    },
  });
}

export function useOutgoingFriendRequests() {
  return useQuery<OutgoingFriendRequest[]>({
    queryKey: ["friend-requests", "outgoing"],
    queryFn: getOutgoingFriendRequestsApi,
  });
}
