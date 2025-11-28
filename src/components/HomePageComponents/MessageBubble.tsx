import type { ChatMessage } from "@/hook/useChatSocket";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  nickname: string;
  timeLabel: string;
  showTime: boolean;
}

export default function MessageBubble({
  message,
  isMine,
  nickname,
  timeLabel,
  showTime,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
        {/* 상대방일 때 닉네임 */}
        {!isMine && (
          <div className="text-muted-foreground mb-px flex items-baseline gap-2 text-[11px]">
            <span className="font-medium">{nickname}</span>
          </div>
        )}

        {/* 말풍선 + 시간 (내 메시지면 시간 왼쪽, 상대 메시지면 시간 오른쪽) */}
        <div
          className={`flex items-end gap-1 ${
            isMine ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* 말풍선 */}
          <div
            className={`inline-block max-w-[8em] rounded-2xl px-3 py-2 text-[13px] break-words whitespace-pre-wrap ${
              isMine
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            }`}
          >
            {message.content}
          </div>

          {/* 시간 레이블 */}
          {showTime && (
            <span className="text-muted-foreground text-[10px]">
              {timeLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
