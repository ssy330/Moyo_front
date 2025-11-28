// src/components/modal/GroupMemberModal.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useOutgoingFriendRequests,
  useSendFriendRequest,
} from "@/hook/use-send-friend-request";
import { resolveAvatarUrl } from "@/utils/resolve-avatar-url";
import { useMyFriends } from "@/hook/use-friend";

type GroupRole = "OWNER" | "MANAGER" | "MEMBER";

type GroupMemberUser = {
  id: number;
  name?: string | null;
  nickname?: string | null;
  profile_image_url?: string | null;
};

type GroupMember = {
  id: number;
  user_id: number;
  role: GroupRole;
  joined_at: string;
  user?: GroupMemberUser;
};

type GroupDetailResponse = {
  group: {
    id: number;
    name: string;
    member_count: number;
  };
  members: GroupMember[];
};

interface GroupMemberModalProps {
  open: boolean;
  onClose: () => void;
  groupId: number;
}

function roleLabel(role: GroupRole) {
  switch (role) {
    case "OWNER":
      return "방장";
    case "MANAGER":
      return "매니저";
    default:
      return "멤버";
  }
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null) {
    const maybeAxios = error as {
      response?: { data?: { detail?: string; message?: string } };
      message?: string;
    };

    if (typeof maybeAxios.response?.data?.detail === "string") {
      return maybeAxios.response.data.detail;
    }
    if (typeof maybeAxios.response?.data?.message === "string") {
      return maybeAxios.response.data.message;
    }
    if (typeof maybeAxios.message === "string") {
      return maybeAxios.message;
    }
  }

  return "멤버 정보를 불러오는 중 오류가 발생했습니다.";
}

export default function GroupMemberModal({
  open,
  onClose,
  groupId,
}: GroupMemberModalProps) {
  const [data, setData] = useState<GroupDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 현재 로그인 유저
  const currentUser = useSelector((state: RootState) => state.session.session);

  const memberCount = data?.group.member_count ?? data?.members.length ?? 0;

  // ✅ 친구 요청 훅
  const { mutate: sendFriendRequest, isPending: isSending } =
    useSendFriendRequest();

  const { data: friends = [] } = useMyFriends();
  const { data: outgoing = [] } = useOutgoingFriendRequests();

  // targetUserId 기준 친구/요청 상태 계산
  const getRelationState = (targetUserId: number) => {
    if (!currentUser) return "none" as const;
    if (currentUser.id === targetUserId) return "me" as const;

    // 이미 친구인지
    const isFriend = friends.some((f) => f.friend.id === targetUserId);
    if (isFriend) return "friend" as const;

    // 내가 보낸 PENDING 요청이 있는지
    const hasPendingOutgoing = outgoing.some(
      (req) => req.receiver.id === targetUserId && req.status === "PENDING",
    );
    if (hasPendingOutgoing) return "pending" as const;

    return "none" as const;
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<GroupDetailResponse>(`/groups/${groupId}`);
        if (cancelled) return;
        setData(res.data);
      } catch (err: unknown) {
        console.error(err);
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, [open, groupId]);

  const handleClickFriend = (targetUserId: number) => {
    if (!currentUser) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    const state = getRelationState(targetUserId);
    if (state === "me" || state === "friend" || state === "pending") {
      // 이미 친구거나, 나 자신이거나, 요청 대기 중이면 아무 것도 안 함
      return;
    }

    sendFriendRequest({ receiver_id: targetUserId, group_id: groupId });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-full max-w-lg rounded-2xl p-4">
        <DialogHeader className="mb-2 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-base font-semibold text-neutral-900">
              멤버 관리
            </DialogTitle>
          </div>

          <div className="flex items-center justify-between gap-2">
            <DialogDescription className="text-xs text-neutral-500">
              {data?.group.name ?? "그룹"}의 멤버 목록이에요.
            </DialogDescription>

            <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
              멤버 {memberCount}명
            </span>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
            멤버 정보를 불러오는 중입니다…
          </div>
        )}

        {error && !loading && (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-red-500">
            <span>{error}</span>
            <DialogClose asChild>
              <button className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-200">
                닫기
              </button>
            </DialogClose>
          </div>
        )}

        {!loading && !error && (
          <div className="max-h-80 space-y-1 overflow-y-auto pr-1">
            {data?.members.length ? (
              data.members.map((m) => {
                const u = m.user;

                const avatarUrl = resolveAvatarUrl(u?.profile_image_url);
                const displayName =
                  u?.name ??
                  u?.nickname ??
                  `사용자 #${u?.id ?? m.user_id ?? m.id}`;
                const nickSuffix = u?.nickname ? `@${u.nickname}` : "";
                const joined = m.joined_at
                  ? new Date(m.joined_at).toLocaleDateString("ko-KR")
                  : "";

                const targetUserId = u?.id ?? m.user_id;
                const relationState = getRelationState(targetUserId);
                const isMe = relationState === "me";

                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-neutral-50"
                  >
                    {/* 프로필 */}
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-200">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">👤</span>
                      )}
                    </div>

                    {/* 이름, 역할, 가입일 */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-sm font-medium text-neutral-900">
                          {displayName}
                        </span>
                        {nickSuffix && (
                          <span className="truncate text-[11px] text-neutral-500">
                            {nickSuffix}
                          </span>
                        )}
                        {isMe && (
                          <span className="ml-1 text-[11px] text-neutral-400">
                            (나)
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-500">
                        <span>{roleLabel(m.role)}</span>
                        {joined && (
                          <>
                            <span className="text-neutral-300">•</span>
                            <span>{joined} 가입</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 친구 / 요청 상태에 따른 버튼 */}
                    {!isMe && (
                      <>
                        {relationState === "friend" && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                            이미 친구
                          </span>
                        )}

                        {relationState === "pending" && (
                          <button
                            type="button"
                            className="cursor-default rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-emerald-400"
                            disabled
                          >
                            요청 중...
                          </button>
                        )}

                        {relationState === "none" && (
                          <button
                            type="button"
                            className="rounded-full border border-emerald-200 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                            onClick={() => handleClickFriend(targetUserId)}
                            disabled={isSending}
                          >
                            {isSending ? "요청 중..." : "친구 추가"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
                아직 이 그룹의 멤버가 없습니다.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
