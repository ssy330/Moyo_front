// src/components/ChatRoomPanel.tsx
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
} from "react";
import { ArrowLeft } from "lucide-react";
import { useChatSocket, type ChatMessage } from "@/hooks/useChatSocket";
import MessageBubble from "./MessageBubble";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { API_BASE } from "@/lib/api";
import { getChatBubbleTimeMeta } from "@/utils/ChatTimeFunc";

interface Room {
  id: number;
  name: string;
  created_at: string;
}

interface ChatMessageDTO {
  id: number;
  room_id: number;
  user_id: number | null;
  content: string;
  created_at: string;
  user_nickname?: string | null;
}

interface ChatRoomPanelProps {
  chatId: string | null;
  onBack: () => void;
}

const ChatRoomPanel = ({ chatId, onBack }: ChatRoomPanelProps) => {
  const roomId = chatId ? Number(chatId) : null;

  const [roomName, setRoomName] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const currentUserId = useSelector(
    (state: RootState) => state.session.session?.id ?? null,
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 방 이름 불러오기
  useEffect(() => {
    if (!roomId) {
      setRoomName("");
      return;
    }

    fetch(`${API_BASE}/rooms/`)
      .then((res) => res.json())
      .then((data: Room[]) => {
        const room = data.find((r) => r.id === roomId);
        setRoomName(room?.name ?? `Room #${roomId}`);
      })
      .catch(() => {
        setRoomName(`Room #${roomId}`);
      });
  }, [roomId]);

  // 기존 메시지 불러오기
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    fetch(`${API_BASE}/messages/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data: ChatMessageDTO[]) => {
        const mapped: ChatMessage[] = data.map((m) => ({
          id: m.id,
          room_id: m.room_id,
          user_id: m.user_id,
          content: m.content,
          created_at: m.created_at,
          nickname: m.user_nickname ?? null,
        }));
        setMessages(mapped);
      })
      .catch((e) => console.error("메시지 불러오기 실패", e));
  }, [roomId]);

  // WebSocket 연결
  const handleIncomingMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        created_at: msg.created_at ?? new Date().toISOString(),
      },
    ]);
  }, []);

  const { connected, sendMessage } = useChatSocket({
    groupId: roomId ?? 0,
    onMessage: handleIncomingMessage,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !roomId) return;

    sendMessage({ content: text });
    setInput("");
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 아직 방이 선택되지 않은 경우
  if (!chatId) {
    return (
      <div className="border-border bg-card text-muted-foreground flex h-[calc(90vh)] items-center justify-center rounded-2xl border shadow-lg">
        채팅을 선택해주세요 💬
      </div>
    );
  }

  return (
    <div className="border-border bg-card flex h-[calc(90vh)] flex-col rounded-2xl border shadow-lg">
      {/* 헤더 */}
      <div className="border-border bg-card flex h-12 items-center justify-between border-b px-4">
        <button onClick={onBack} className="text-muted-foreground text-sm">
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 items-center justify-between md:justify-start md:gap-3">
          <div className="text-foreground font-semibold">
            {roomName || `Room #${chatId}`}
          </div>
          <span
            className={`text-xs ${
              connected ? "text-primary" : "text-destructive"
            }`}
          >
            {connected ? "실시간 연결됨" : "연결 안 됨"}
          </span>
        </div>

        <button className="text-muted-foreground hover:text-foreground hidden text-sm md:inline">
          ⚙️
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-2 overflow-y-auto bg-white p-4">
        {messages.map((m, idx) => {
          const {
            showDateSeparator,
            dateLabel,
            timeLabel,
            sameMinuteWithNext,
          } = getChatBubbleTimeMeta(messages, idx);

          const next = idx < messages.length - 1 ? messages[idx + 1] : null;

          const isMine = currentUserId != null && m.user_id === currentUserId;

          const nickname = m.nickname ?? "익명";

          const sameMinuteAndSameSenderWithNext =
            next && next.user_id === m.user_id && sameMinuteWithNext;

          const showTime = !sameMinuteAndSameSenderWithNext;

          return (
            <div key={m.id}>
              {/* 날짜 구분선 */}
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
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="border-border bg-card border-t p-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-input text-foreground focus:ring-primary w-full flex-1 rounded-xl border p-2 text-sm focus:ring-2 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!connected || !input.trim()}
            className={`rounded-xl px-4 text-sm font-medium ${
              connected
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPanel;
