import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { api } from "@/lib/api";
import { useChatSocket, type ChatMessage } from "@/hooks/useChatSocket";
import { getChatBubbleTimeMeta } from "@/utils/ChatTimeFunc";
import MessageBubble from "../HomePageComponents/MessageBubble";

interface GroupChatPanelProps {
  groupId: number;
  onClose: () => void;
  onNewMessage?: (msg: ChatMessage) => void;
}

interface ChatMessageDTO {
  id: number;
  room_id: number;
  user_id: number | null;
  content: string;
  created_at: string;
  user_nickname?: string | null;
}

export default function GroupChatPanel({
  groupId,
  onClose,
  onNewMessage,
}: GroupChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = useSelector(
    (state: RootState) => state.session.session?.id ?? null,
  );

  const handleIncomingMessage = useCallback(
    (msg: ChatMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          created_at: msg.created_at ?? new Date().toISOString(),
        },
      ]);
      onNewMessage?.(msg);
    },
    [onNewMessage],
  );

  const { connected, sendMessage } = useChatSocket({
    groupId,
    onMessage: handleIncomingMessage,
  });

  useEffect(() => {
    if (!groupId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await api.get<ChatMessageDTO[]>(
          `/messages/rooms/${groupId}`,
        );

        if (cancelled) return;

        const raw = res.data;

        const mapped: ChatMessage[] = raw.map((m) => ({
          id: m.id,
          room_id: m.room_id,
          user_id: m.user_id,
          content: m.content,
          created_at: m.created_at,
          nickname: m.user_nickname ?? null,
        }));

        setMessages(mapped);
      } catch (err) {
        console.error("그룹 채팅 메시지 불러오기 실패:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage({ content: text });
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card flex h-[420px] flex-col">
      {/* 헤더 */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-primary h-5 w-5" />
          <span className="text-foreground text-sm font-semibold">
            그룹 채팅 · #{groupId}
          </span>

          <span
            className={`ml-2 h-2 w-2 rounded-full ${
              connected ? "bg-primary" : "bg-muted-foreground"
            }`}
          />
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 채팅 내용 영역 */}
      <div className="text-muted-foreground flex-1 overflow-y-auto px-4 py-3 text-sm">
        {loading ? (
          <p className="text-muted-foreground/70">
            메시지를 불러오는 중입니다...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-muted-foreground/70">
            아직 메시지가 없습니다. 첫 메시지를 보내보세요!
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((m, idx) => {
              const {
                showDateSeparator,
                dateLabel,
                timeLabel,
                sameMinuteWithNext,
              } = getChatBubbleTimeMeta(messages, idx);

              const next = idx < messages.length - 1 ? messages[idx + 1] : null;

              const isMine =
                currentUserId != null && m.user_id === currentUserId;

              const nickname = m.nickname ?? "익명";

              const sameMinuteAndSameSenderWithNext =
                next && next.user_id === m.user_id && sameMinuteWithNext;

              const showTime = !sameMinuteAndSameSenderWithNext;

              return (
                <div key={m.id}>
                  {showDateSeparator && (
                    <div className="my-3 flex justify-center">
                      <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-[11px]">
                        {dateLabel}
                      </span>
                    </div>
                  )}

                  <MessageBubble
                    message={m}
                    isMine={isMine}
                    nickname={nickname}
                    showTime={showTime}
                    timeLabel={timeLabel}
                  />
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* 입력창 */}
      <div className="border-border flex items-center gap-2 border-t px-3 py-2">
        <input
          className="border-input focus:border-primary h-9 flex-1 rounded-full border px-3 text-sm outline-none"
          placeholder={
            connected
              ? "메시지 보내기..."
              : "연결 중입니다. 잠시만 기다려주세요..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 w-10 items-center justify-center rounded-full text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSend}
          disabled={!connected || !input.trim()}
        >
          <Send className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
