// src/components/ChatRoomPanel.tsx
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
} from "react";
import { ArrowLeft } from "lucide-react";
import { useChatSocket, type ChatMessage } from "@/hook/useChatSocket";
import MessageBubble from "./MessageBubble";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface Room {
  id: number;
  name: string;
  created_at: string;
}

interface ChatRoomPanelProps {
  chatId: string | null;
  onBack: () => void;
}

const API_URL = import.meta.env.VITE_API_BASE;

const ChatRoomPanel = ({ chatId, onBack }: ChatRoomPanelProps) => {
  const roomId = chatId ? Number(chatId) : null;

  const [roomName, setRoomName] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  // 🔹 Redux에서 로그인 유저 id 가져오기
  const currentUserId = useSelector(
    (state: RootState) => state.auth.id, // 🔥 slice 이름에 맞춰서
  );

  console.log("user Id", currentUserId);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ─────────────────────────────────
  // 방 이름 불러오기
  // ─────────────────────────────────
  useEffect(() => {
    if (!roomId) {
      setRoomName("");
      return;
    }

    fetch(`${API_URL}/rooms/`)
      .then((res) => res.json())
      .then((data: Room[]) => {
        const room = data.find((r) => r.id === roomId);
        setRoomName(room?.name ?? `Room #${roomId}`);
      })
      .catch(() => {
        setRoomName(`Room #${roomId}`);
      });
  }, [roomId]);

  // ─────────────────────────────────
  // 선택된 방의 기존 메시지 불러오기
  // ─────────────────────────────────
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    fetch(`${API_URL}/messages/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data: ChatMessage[]) => {
        setMessages(data);
      })
      .catch((e) => console.error("메시지 불러오기 실패", e));
  }, [roomId]);

  // ─────────────────────────────────
  // WebSocket 연결 + 메시지 수신 핸들러
  // ─────────────────────────────────
  const handleIncomingMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { connected, sendMessage } = useChatSocket({
    roomId: roomId ?? 0,
    onMessage: handleIncomingMessage,
  });

  // 새로운 메시지 오면 맨 아래로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─────────────────────────────────
  // 메시지 보내기
  // ─────────────────────────────────
  const handleSend = () => {
    const text = input.trim();
    if (!text || !roomId) return;

    // 닉네임은 서버가 user에서 알아서 붙임
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
      <div className="flex h-[calc(90vh)] items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-400 shadow-lg">
        채팅을 선택해주세요 💬
      </div>
    );
  }

  return (
    <div className="flex h-[calc(90vh)] flex-col rounded-2xl border border-neutral-200 bg-white shadow-lg">
      {/* 헤더 */}
      <div className="flex h-12 items-center justify-between border-b bg-white px-4">
        <button onClick={onBack} className="text-sm text-neutral-500">
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 items-center justify-between md:justify-start md:gap-3">
          <div className="font-semibold text-neutral-800">
            {roomName || `Room #${chatId}`}
          </div>
          <span
            className={`text-xs ${
              connected ? "text-emerald-500" : "text-red-400"
            }`}
          >
            {connected ? "실시간 연결됨" : "연결 안 됨"}
          </span>
        </div>

        <button className="hidden text-sm text-neutral-500 hover:text-neutral-800 md:inline">
          ⚙️
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-2 overflow-y-auto bg-neutral-50 p-4">
        {messages.map((m) => {
          const isMine = currentUserId != null && m.user_id === currentUserId; // 🔥 내 메시지 판별
          return (
            <MessageBubble
              key={m.id}
              message={m}
              isMine={isMine}
              nickname={m.nickname ?? `User ${m.user_id ?? "?"}`} // 🔥 여기서 닉네임 넘김
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="border-t bg-white p-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full flex-1 rounded-xl border border-neutral-300 p-2 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!connected || !input.trim()}
            className={`rounded-xl px-4 text-sm font-medium text-white ${
              connected
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "cursor-not-allowed bg-neutral-400"
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
