// src/hooks/useChatSocket.ts
import { useEffect, useRef, useState, useCallback } from "react";

export interface ChatMessage {
  id: number;
  room_id: number;
  user_id: number | null;
  content: string;
  created_at: string;
  nickname?: string | null; // 🔹 서버에서 내려주는 닉네임
}

interface UseChatSocketProps {
  roomId: number;
  onMessage?: (msg: ChatMessage) => void;
}

type OutgoingPayload = {
  content: string; // ✔️ 이제 닉네임은 서버에서 처리하니까 content만 보내도 됨
};

export function useChatSocket({ roomId, onMessage }: UseChatSocketProps) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // 🔹 로그인 때 저장해둔 토큰 꺼내오기 (예: localStorage)
    const token = localStorage.getItem("access_token") ?? "";

    const API_BASE = import.meta.env.VITE_API_BASE; // http://localhost:8000/api/v1
    const WS_BASE = API_BASE.replace(/^http/, "ws").replace(/\/api\/v1$/, "");
    const url = `${WS_BASE}/ws/rooms/${roomId}?token=${encodeURIComponent(
      token,
    )}`;

    console.log("🌐 WS connect try:", url);

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("✅ WebSocket connected");
    };

    ws.onclose = (event) => {
      setConnected(false);
      console.log("❌ WebSocket disconnected", event.code, event.reason);
    };

    ws.onerror = (e) => {
      console.error("WebSocket error", e);
    };

    ws.onmessage = (event) => {
      try {
        const data: ChatMessage = JSON.parse(event.data);
        onMessage?.(data);
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "component unmount");
      } else {
        ws.close();
      }
    };
  }, [roomId, onMessage]);

  const sendMessage = useCallback((payload: OutgoingPayload) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket not open, cannot send");
      return;
    }
    socketRef.current.send(JSON.stringify(payload));
  }, []);

  return { connected, sendMessage };
}
