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
import { useChatSocket, type ChatMessage } from "@/hook/useChatSocket";
import { getChatBubbleTimeMeta } from "@/utils/ChatTimeFunc";
import MessageBubble from "../HomePageComponents/MessageBubble";

interface GroupChatPanelProps {
  groupId: number;
  onClose: () => void;
  onNewMessage?: (msg: ChatMessage) => void;
}

// 🔹 백엔드 메시지 응답 타입
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

  // Redux에서 내 id 꺼내오기
  const currentUserId = useSelector((state: RootState) => state.auth.id);

  // WebSocket으로 들어오는 메시지 핸들링
  const handleIncomingMessage = useCallback(
    (msg: ChatMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          created_at: msg.created_at ?? new Date().toISOString(),
        },
      ]);

      // ✅ 부모에게 새 메시지 전달
      onNewMessage?.(msg);
      // 혹시 "내가 보낸 건 안 읽음 처리 안 하고 싶다"면:
      // if (msg.user_id !== currentUserId) onNewMessage?.(msg);
    },
    [onNewMessage], // (또는 [onNewMessage, currentUserId])
  );

  // WebSocket 연결 (groupId 기준)
  const { connected, sendMessage } = useChatSocket({
    groupId,
    onMessage: handleIncomingMessage,
  });

  // 처음 들어왔을 때 기존 메시지 REST로 가져오기
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

  // 메시지 변경 시 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 보내기
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    // created_at은 서버에서 생성
    sendMessage({
      content: text,
    });

    setInput("");
  };

  // Enter 키로 전송
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[420px] flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-semibold">그룹 채팅 · #{groupId}</span>

          <span
            className={`ml-2 h-2 w-2 rounded-full ${
              connected ? "bg-emerald-500" : "bg-neutral-300"
            }`}
          />
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 채팅 내용 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-neutral-700">
        {loading ? (
          <p className="text-neutral-400">메시지를 불러오는 중입니다...</p>
        ) : messages.length === 0 ? (
          <p className="text-neutral-400">
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

              // 같은 사람 + 같은 분이면 묶어서 마지막만 시간 표시
              const sameMinuteAndSameSenderWithNext =
                next && next.user_id === m.user_id && sameMinuteWithNext;

              const showTime = !sameMinuteAndSameSenderWithNext;

              return (
                <div key={m.id}>
                  {showDateSeparator && (
                    <div className="my-3 flex justify-center">
                      <span className="rounded-full bg-neutral-200 px-3 py-1 text-[11px] text-neutral-600">
                        {dateLabel}
                      </span>
                    </div>
                  )}

                  {/* 여기부터 말풍선 JSX 있었던 부분을 MessageBubble로 대체 */}
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
      <div className="flex items-center gap-2 border-t px-3 py-2">
        <input
          className="h-9 flex-1 rounded-full border border-neutral-200 px-3 text-sm outline-none focus:border-emerald-400"
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
          className="flex h-9 w-10 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSend}
          disabled={!connected || !input.trim()}
        >
          <Send className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
