import { API_BASE } from "@/lib/api";
import { useEffect, useRef, useState, useCallback } from "react";

export interface ChatMessage {
  id: number;
  room_id: number;
  user_id: number | null;
  content: string;
  created_at: string;
  nickname?: string | null;
}

interface UseChatSocketProps {
  groupId: number;
  onMessage?: (msg: ChatMessage) => void;
}

type OutgoingPayload = {
  content: string;
  created_at?: string;
};

export function useChatSocket({ groupId, onMessage }: UseChatSocketProps) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const token = localStorage.getItem("access_token") ?? "";

    const WS_BASE = API_BASE.replace(/^http/, "ws").replace(/\/api\/v1$/, "");
    const url = `${WS_BASE}/ws/rooms/${groupId}?token=${encodeURIComponent(
      token,
    )}`;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = () => {
      // 조용히 무시 (필요하면 여기서만 에러 처리 추가)
    };

    ws.onmessage = (event) => {
      try {
        const data: ChatMessage = JSON.parse(event.data);
        onMessage?.(data);
      } catch {
        // 잘못된 메시지는 무시
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "component unmount");
      } else {
        ws.close();
      }
    };
  }, [groupId, onMessage]);

  const sendMessage = useCallback((payload: OutgoingPayload) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    socket.send(JSON.stringify(payload));
  }, []);

  return { connected, sendMessage };
}
