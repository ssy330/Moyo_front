// src/components/ChatRoomItem.tsx
import { type Room } from "@/hooks/use-my-chat-room";
import {
  parseServerDateAsUTC,
  formatRoomPreviewTimeKorea,
} from "@/utils/ChatTimeFunc";
import { resolveAvatarUrl } from "@/utils/resolve-avatar-url";

interface ChatRoomItemProps {
  room: Room;
  isActive: boolean;
  onClick: () => void;
}

export default function ChatRoomItem({
  room,
  isActive,
  onClick,
}: ChatRoomItemProps) {
  const createdAtLabel = room.created_at
    ? formatRoomPreviewTimeKorea(parseServerDateAsUTC(room.created_at))
    : "";

  const groupName = room.group?.name ?? room.name;
  const imageUrl = resolveAvatarUrl(room.group?.image_url ?? null);

  // 방 이름 이니셜 같은 거 (이미지 없을 때)
  const initials = groupName.slice(0, 2);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative mb-3 flex w-full cursor-pointer items-center rounded-xl px-3 py-3.5 text-left transition ${
        isActive
          ? "bg-primary/10 ring-primary/50 ring-1"
          : "bg-card hover:bg-muted/60"
      }`}
    >
      {/* 🔹 왼쪽 그룹 이미지 영역 */}
      <div className="bg-muted mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={groupName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground text-[11px] font-semibold">
            {initials}
          </span>
        )}
      </div>

      {/* 🔹 오른쪽 텍스트 영역 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="text-foreground line-clamp-1 text-sm font-semibold">
          {room.name}
        </div>
        <div className="text-muted-foreground mt-1 text-[11px]">
          {createdAtLabel}
        </div>
      </div>
    </button>
  );
}
