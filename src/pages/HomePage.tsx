import ChattingPanel from "@/components/HomePageComponents/ChattingPanel";
import ChatRoomPanel from "@/components/HomePageComponents/ChatRoomPanel";
import GroupPanel from "@/components/HomePageComponents/GroupPanel";
import ViewModeButtonGroup from "@/components/HomePageComponents/ViewModeButtonGroup";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"both" | "panel" | "chat">("both");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  type ViewMode = "both" | "panel" | "chat"; // 이미 있음

  const baseOptions: { key: ViewMode; label: string }[] = [
    { key: "panel", label: "패널만" },
    { key: "chat", label: "채팅만" },
  ];

  const options: { key: ViewMode; label: string }[] = isMobile
    ? baseOptions
    : [...baseOptions, { key: "both", label: "둘 다" }];

  // ✅ 화면 크기 감지하여 모드 제어
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      setIsMobile(mobile);

      // 모바일일 경우 모드 자동 보정
      setViewMode((prev) => {
        if (mobile) {
          // "both"는 불가능 → "panel"로
          if (prev === "both") return "panel";
        }
        return prev;
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ 모바일에서 "chat" 모드는 덮어쓰기로 강제
  const isOverlayChat = isMobile && viewMode === "chat";

  return (
    <div className="relative px-4 pt-16">
      {/* 뷰모드 버튼 */}
      <div className="absolute top-1 right-1">
        <ViewModeButtonGroup
          value={viewMode}
          onChange={(mode) => {
            // 모바일에서는 both 선택 차단
            if (isMobile && mode === "both") return;
            setViewMode(mode);
          }}
          options={options}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div
        className={`flex w-full flex-col gap-6 transition-all duration-300 ${
          viewMode === "both" ? "lg:flex-row" : ""
        }`}
      >
        {/* === 그룹 패널 === */}
        {(viewMode === "both" || viewMode === "panel") && (
          <section
            className={`flex-1 ${viewMode === "both" ? "lg:w-1/2" : "w-full"}`}
          >
            <GroupPanel viewMode={viewMode} />
          </section>
        )}

        {/* === 채팅 패널 === */}
        {(viewMode === "both" || viewMode === "chat") && (
          <aside
            className={`relative flex w-full flex-1 flex-col ${
              viewMode === "chat"
                ? isOverlayChat
                  ? "min-h-[calc(90vh)] flex-col" // ✅ 모바일: 덮어쓰기
                  : "min-h-[calc(90vh)] w-full flex-row gap-6" // ✅ 데스크탑: 옆으로
                : "flex-col lg:w-1/2"
            }`}
          >
            {/* ✅ 채팅 목록 */}
            <div
              className={`${
                !isOverlayChat && viewMode === "chat"
                  ? "w-[360px] min-w-[340px] border-r border-gray-200"
                  : "absolute inset-0 transition-all duration-300"
              } ${
                !isOverlayChat && viewMode !== "chat" && selectedChat
                  ? "pointer-events-none translate-x-[-10%] opacity-0"
                  : ""
              }`}
            >
              <ChattingPanel onSelectChat={setSelectedChat} />
            </div>

            {/* ✅ 채팅방 */}
            {selectedChat && (
              <div
                className={`${
                  !isOverlayChat && viewMode === "chat"
                    ? "min-w-0 flex-1"
                    : "absolute inset-0 z-10 bg-white transition-all duration-300"
                } ${
                  !isOverlayChat && viewMode !== "chat"
                    ? "translate-x-0 opacity-100"
                    : ""
                }`}
              >
                <ChatRoomPanel
                  chatId={selectedChat}
                  onBack={() => setSelectedChat(null)}
                />
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
