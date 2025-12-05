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
  //    - 모바일: 목록 전체 화면 → 클릭 시 채팅방이 위에서 덮어쓰는 구조
  //    - 데스크탑: 기존처럼 좌측 목록 + 우측 채팅 2분할
  // ─────────────────────────────
  if (viewMode === "chat") {
    return (
      // ✅ 공통 부모에 고정 높이 부여 (예: 90vh)
      <div className="h-[90vh] w-full">
        {/* ✅ 모바일 전용 레이아웃 (md 미만) */}
        <div className="relative flex h-full w-full overflow-hidden md:hidden">
          {/* 채팅 목록 (선택 전) */}
          {!selectedChatId && (
            // ✅ 목록 영역도 h-full + 스크롤
            <div className="h-full w-full overflow-y-auto">
              <ChattingPanel
                onSelectChat={handleSelectChat}
                selectedChatId={selectedChatId}
              />
            </div>
          )}

          {/* 채팅방 (선택 후 전체 덮기) */}
          {selectedChatId && (
            <div className="absolute inset-0 flex flex-col overflow-hidden bg-white">
              <div className="flex h-full flex-col overflow-hidden">
                <ChatRoomPanel chatId={selectedChatId} onBack={handleBack} />
              </div>
            </div>
          )}
        </div>

        {/* ✅ 데스크탑 레이아웃 (md 이상) */}
        <div className="hidden h-full w-full overflow-hidden md:flex">
          {/* 왼쪽: 채팅 목록 패널 */}
          <div className="flex h-full w-[480px] min-w-[280px] flex-col border-r border-gray-200">
            {/* ✅ 여기서도 내부 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto">
              <ChattingPanel
                onSelectChat={handleSelectChat}
                selectedChatId={selectedChatId}
              />
            </div>
          </div>

          {/* 오른쪽: 채팅방 / 플레이스홀더 */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {selectedChatId ? (
              <div className="flex h-full flex-col overflow-hidden">
                <ChatRoomPanel chatId={selectedChatId} onBack={handleBack} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                채팅방을 선택해주세요.
              </div>
            )}
          </div>
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
