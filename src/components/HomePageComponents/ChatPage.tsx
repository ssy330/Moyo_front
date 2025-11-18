// src/pages/ChatPage.tsx
import { useState } from "react";
import ChattingPanel from "./ChattingPanel";
import ChatRoomPanel from "./ChatRoomPanel";

type ViewMode = "chat" | "both" | "panel";

interface ChatPageProps {
  viewMode: ViewMode;
}

export default function ChatPage({ viewMode }: ChatPageProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleSelectChat = (id: string) => setSelectedChatId(id);
  const handleBack = () => setSelectedChatId(null);

  if (viewMode === "panel") {
    // 패널 모드일 땐 채팅 안 보이게
    return null;
  }

  // ─────────────────────────────
  // 🔹 1) viewMode === "chat"
  //    - 모바일: 가로 슬라이드 (왼쪽 목록 / 오른쪽 채팅)
  //    - 데스크탑: 항상 "왼쪽 320px 목록 + 오른쪽 채팅/플레이스홀더"
  // ─────────────────────────────
  if (viewMode === "chat") {
    return (
      <div className="flex h-[90vh] w-full">
        {/* 왼쪽: 채팅 목록 패널 */}
        <div className="w-[480px] min-w-[280px] border-r border-gray-200">
          <ChattingPanel
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChatId}
          />
        </div>

        {/* 오른쪽: 채팅방 / 플레이스홀더 */}
        <div className="flex flex-1 flex-col">
          {selectedChatId ? (
            <ChatRoomPanel chatId={selectedChatId} onBack={handleBack} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              채팅방을 선택해주세요.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────
  // 🔹 2) viewMode === "both"
  //    - HomePage 오른쪽 패널 안에서
  //    - 기본: 목록만
  //    - 방 클릭 시: 그 위에 채팅방 overlay
  // ─────────────────────────────
  return (
    <div className="relative h-[90vh]">
      {/* 아래: 채팅 목록 */}
      <div
        className={`h-full transition-all duration-300 ${
          selectedChatId
            ? "pointer-events-none translate-x-[-10%] opacity-0"
            : ""
        }`}
      >
        <ChattingPanel
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
        />
      </div>

      {/* 위: 선택된 채팅방 overlay */}
      {selectedChatId && (
        <div className="absolute inset-0 flex flex-col bg-white shadow-lg">
          <ChatRoomPanel chatId={selectedChatId} onBack={handleBack} />
        </div>
      )}
    </div>
  );
}
