import ChattingPanel from "@/components/HomePageComponents/ChattingPanel";
import ChatRoomPanel from "@/components/HomePageComponents/ChatRoomPanel";
import GroupPanel from "@/components/HomePageComponents/GroupPanel";
import ViewModeButtonGroup from "@/components/HomePageComponents/ViewModeButtonGroup";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"both" | "panel" | "chat">("both");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    if (viewMode === "chat") return;
    const handleResize = () => {
      const width = window.innerWidth;
      setViewMode((prev) => {
        if (width < 1024) return prev === "both" ? "panel" : prev;
        else return prev === "panel" ? "both" : prev;
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative px-4 pt-12 sm:px-8 lg:px-20">
      <ViewModeButtonGroup value={viewMode} onChange={setViewMode} />

      <div className="flex flex-col gap-6 lg:flex-row">
        {(viewMode === "both" || viewMode === "panel") && (
          <section className="w-full flex-1">
            <GroupPanel viewMode={viewMode} />
          </section>
        )}

        {(viewMode === "both" || viewMode === "chat") && (
          <aside className="flex w-full shrink-0 gap-4 lg:w-[850px]">
            {/* 왼쪽: 채팅 목록 */}
            <div className="w-[320px] shrink-0">
              <ChattingPanel onSelectChat={setSelectedChat} />
            </div>
            {/* 오른쪽: 채팅방 본문 */}
            <div className="flex-1">
              <ChatRoomPanel
                chatId={selectedChat}
                onBack={() => setSelectedChat(null)}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
