import ChatPage from "@/components/HomePageComponents/ChatPage";
import GroupPanel from "@/components/HomePageComponents/GroupPanel";
import ViewModeButtonGroup from "@/components/HomePageComponents/ViewModeButtonGroup";

import { useState, useEffect } from "react";

type ViewMode = "both" | "panel" | "chat";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [isMobile, setIsMobile] = useState(false);

  const baseOptions: { key: ViewMode; label: string }[] = [
    { key: "panel", label: "패널만" },
    { key: "chat", label: "채팅만" },
  ];

  const options: { key: ViewMode; label: string }[] = isMobile
    ? baseOptions
    : [...baseOptions, { key: "both", label: "둘 다" }];

  // 화면 크기 감지하여 모드 제어
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      setIsMobile(mobile);

      setViewMode((prev) => {
        if (mobile && prev === "both") return "panel";
        return prev;
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative px-4 pt-16">
      {/* 뷰모드 버튼 */}
      <div className="absolute top-1 right-1">
        <ViewModeButtonGroup
          value={viewMode}
          onChange={(mode) => {
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
          <section
            className={`flex-1 ${viewMode === "both" ? "lg:w-1/2" : "w-full"}`}
          >
            {/* ChatPage는 "chat" | "both"만 받도록 */}
            <ChatPage viewMode={viewMode === "chat" ? "chat" : "both"} />
          </section>
        )}
      </div>
    </div>
  );
}
