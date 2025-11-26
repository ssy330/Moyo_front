// src/pages/NotificationPage.tsx
import { Button } from "@/components/ui/button";
import {
  useAcceptFriendRequest,
  useIncomingFriendRequests,
  useRejectFriendRequest,
} from "@/hook/use-send-friend-request";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { resolveAvatarUrl } from "@/utils/resolve-avatar-url";
import { parseServerDateAsUTC } from "@/utils/ChatTimeFunc";

export default function NotificationPage() {
  const { data, isLoading } = useIncomingFriendRequests();
  const { mutate: accept } = useAcceptFriendRequest();
  const { mutate: reject } = useRejectFriendRequest();

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">알림 불러오는 중...</div>
    );
  }

  const requests = data ?? [];

  return (
    <div className="space-y-3 p-4">
      <h1 className="mb-2 text-lg font-semibold">알림</h1>

      {requests.length === 0 && (
        <div className="text-sm text-slate-500">받은 친구 요청이 없습니다.</div>
      )}

      {requests.map((req) => {
        const avatarUrl = resolveAvatarUrl(req.requester.profile_image_url);
        const groupName = req.group?.name;

        return (
          <div
            key={req.id}
            className="flex items-center justify-between rounded-xl border px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt={req.requester.nickname}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {req.requester.nickname}님이 친구 요청을 보냈어요
                </span>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(parseServerDateAsUTC(req.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                  {groupName
                    ? ` · ${groupName} 그룹에서 온 요청`
                    : req.group_id
                      ? " · 어떤 그룹에서 온 요청"
                      : ""}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => reject(req.id)}
              >
                거절
              </Button>
              <Button size="sm" onClick={() => accept(req.id)}>
                수락
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
