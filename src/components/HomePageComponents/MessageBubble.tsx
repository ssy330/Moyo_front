import type { ChatMessage } from "@/hook/useChatSocket";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  nickname: string; // 부모에서 넘김
}

export default function MessageBubble({
  message,
  isMine,
  nickname,
}: MessageBubbleProps) {
  const timeLabel = new Date(message.created_at).toLocaleTimeString();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: isMine ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        {/* 말풍선 */}
        <div
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            borderBottomRightRadius: isMine ? 2 : 12,
            borderBottomLeftRadius: isMine ? 12 : 2,
            backgroundColor: isMine ? "#2563eb" : "#f3f4f6",
            color: isMine ? "white" : "#111827",
            fontSize: 14,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {/* 내 메시지가 아니면 닉네임 표시 */}
          {!isMine && (
            <div
              style={{
                fontSize: 11,
                marginBottom: 2,
                color: "#6b7280",
                fontWeight: 500,
              }}
            >
              {nickname}
            </div>
          )}
          <div>{message.content}</div>
        </div>

        {/* 시간 */}
        <div
          style={{
            fontSize: 10,
            color: "#9ca3af",
            marginBottom: 2,
          }}
        >
          {timeLabel}
        </div>
      </div>
    </div>
  );
}
