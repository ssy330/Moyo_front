// src/components/GroupsPageComponents/GroupChatPanel.tsx
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

interface GroupChatPanelProps {
  groupId: number;
  roomId: number;
  onClose: () => void;
}

export default function GroupChatPanel({
  groupId,
  roomId,
  onClose,
}: GroupChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ 1) Redux에서 내 id 꺼내오기
  const myUserId = useSelector((state: RootState) => state.auth.id);

  const handleIncomingMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  // ✅ WebSocket 연결
  const { connected, sendMessage } = useChatSocket({
    roomId,
    onMessage: handleIncomingMessage,
  });

  // ✅ 처음 들어왔을 때 기존 메시지 REST로 가져오기
  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await api.get(`/messages/rooms/${roomId}`);

        if (cancelled) return;

        const raw = res.data as any[];

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
  }, [roomId]);

  // ✅ 메시지 바뀔 때마다 맨 아래로 스크롤
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
            {messages.map((msg) => {
              const timeLabel = new Date(msg.created_at).toLocaleTimeString();
              const nickname = msg.nickname ?? "익명";

              // ✅ 2) 내 메시지인지 판단
              const isMine =
                myUserId !== null && msg.user_id === Number(myUserId);

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[80%]">
                    <div
                      className={`mb-[1px] flex items-baseline gap-2 text-[11px] text-neutral-400 ${
                        isMine ? "justify-end" : ""
                      }`}
                    >
                      <span className="font-medium">
                        {isMine ? "나" : nickname}
                      </span>
                      <span>{timeLabel}</span>
                    </div>
                    <div
                      className={`rounded-2xl px-3 py-2 text-[13px] ${
                        isMine
                          ? "rounded-br-sm bg-emerald-500 text-white"
                          : "rounded-bl-sm bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
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
