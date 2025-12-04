import { resolveAvatarUrl } from "@/utils/resolve-avatar-url";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export interface FriendRequestNotification {
  id: number;
  requester: {
    nickname: string;
    profile_image_url?: string | null;
  };
  group?: {
    name: string;
  } | null;
  created_at: string;
}

interface BellModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incoming: FriendRequestNotification[];
  notifLoading: boolean;
}

export default function BellModal({
  open,
  onOpenChange,
  incoming,
  notifLoading,
}: BellModalProps) {
  const nav = useNavigate();
  if (!open) return null;

  const handleClose = () => onOpenChange(false);

  const handleGoNotifications = () => {
    handleClose();
    nav("/notifications");
  };

  return (
    // 전체 화면 투명 오버레이 (배경 클릭 시 닫힘)
    <div className="fixed inset-0 z-50" onClick={handleClose}>
      {/* 알림 카드 */}
      <div
        // ✅ 상단 오른쪽에 뜨도록 위치 변경 + 모바일 대응
        className="absolute top-16 right-4 flex max-h-[50vh] w-[320px] max-w-[90vw] flex-col overflow-hidden rounded-2xl border bg-white shadow-xl md:top-auto md:right-auto md:bottom-20 md:left-20 md:max-h-[40vh] md:max-w-[320px]"
        onClick={(e) => e.stopPropagation()} // 카드 안 클릭은 닫히지 않도록
      >
        {/* 헤더 */}
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-semibold">알림</h2>
        </div>

        {/* 스크롤되는 알림 목록 영역 */}
        <div className="max-h-[40vh] min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {notifLoading && (
            <div className="py-6 text-center text-sm text-slate-500">
              알림 불러오는 중...
            </div>
          )}

          {!notifLoading && incoming.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-400">
              받은 친구 요청이 없습니다.
            </div>
          )}

          {!notifLoading &&
            incoming.map((req) => {
              const avatarUrl = resolveAvatarUrl(
                req.requester.profile_image_url ?? null,
              );
              const timeLabel = formatDistanceToNow(new Date(req.created_at), {
                addSuffix: true,
                locale: ko,
              });

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
                        {timeLabel}
                        {req.group?.name &&
                          ` · ${req.group.name} 그룹에서 온 요청`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* 항상 보이는 하단 버튼 영역 */}
        <div className="border-t bg-slate-50 px-3 py-2">
          <button
            className="w-full rounded-xl bg-slate-100 py-2 text-xs text-slate-700 hover:bg-slate-200"
            onClick={handleGoNotifications}
          >
            전체 알림 보기
          </button>
        </div>
      </div>
    </div>
  );
}
