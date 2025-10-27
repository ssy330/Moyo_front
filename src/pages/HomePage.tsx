import Chatting from "@/components/HomePageComponents/Chatting";
import GroupPanel from "@/components/HomePageComponents/GroupPanel";
import ViewModeButtonGroup from "@/components/HomePageComponents/ViewModeButtonGroup";
import { useState } from "react";

const HomePage = () => {
  const [viewMode, setViewMode] = useState<"both" | "panel" | "chat">("both");

  return (
    <div className="relative pt-12 px-20">
      {/* 필터 버튼 */}
      <ViewModeButtonGroup value={viewMode} onChange={setViewMode} />

      {/* 메인 레이아웃 */}
      <div className="flex gap-6 items-start">
        {(viewMode === "both" || viewMode === "panel") && (
          <section className="flex-1">
            <GroupPanel viewMode={viewMode} />
          </section>
        )}
        {(viewMode === "both" || viewMode === "chat") && (
          <aside className="w-[420px] lg:w-[450px] shrink-0">
            <Chatting />
          </aside>
        )}
      </div>
    </div>
  );
};

export default HomePage;
