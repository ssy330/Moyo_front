import ChattingPanel from "@/components/HomePageComponents/ChattingPanel";
import GroupPanel from "@/components/HomePageComponents/GroupPanel";
import ViewModeButtonGroup from "@/components/HomePageComponents/ViewModeButtonGroup";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"both" | "panel" | "chat">("both");

  useEffect(() => {
    if (viewMode === "chat") return;
    const handleResize = () => {
      const width = window.innerWidth;

      setViewMode((prev) => {
        // 📱 좁아졌을 때
        if (width < 1024) {
          return prev === "both" ? "panel" : prev;
        }
        // 💻 넓어졌을 때
        else {
          return prev === "panel" ? "both" : prev;
        }
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative px-4 pt-12 sm:px-8 lg:px-20">
      {/* 필터 버튼 */}
      <ViewModeButtonGroup value={viewMode} onChange={setViewMode} />

      {/* 메인 레이아웃 */}
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        {(viewMode === "both" || viewMode === "panel") && (
          <section className="w-full flex-1">
            <GroupPanel viewMode={viewMode} />
          </section>
        )}

        {(viewMode === "both" || viewMode === "chat") && (
          <aside className="w-full shrink-0 lg:w-[420px] xl:w-[450px]">
            <ChattingPanel />
          </aside>
        )}
      </div>
    </div>
  );
}
