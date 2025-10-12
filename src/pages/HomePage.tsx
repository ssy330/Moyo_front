import Chatting from "@/components/HomePageComponents/Chatting";
import GroupPanel from "@/components/HomePageComponents/GroupPanel";
import { useState } from "react";

const HomePage = () => {
  const [viewMode, setViewMode] = useState<"both" | "panel" | "chat">("both");

  return (
    <div className="relative pt-12 px-20">
      {/* 필터 버튼 */}
      <div className="absolute top-4 right-10 flex items-center gap-3">
        <button
          onClick={() => setViewMode("panel")}
          className={`px-3 py-1 rounded-md border ${
            viewMode === "panel"
              ? "bg-rose-200 border-rose-400"
              : "bg-white border-gray-300"
          }`}
        >
          패널만
        </button>
        <button
          onClick={() => setViewMode("chat")}
          className={`px-3 py-1 rounded-md border ${
            viewMode === "chat"
              ? "bg-rose-200 border-rose-400"
              : "bg-white border-gray-300"
          }`}
        >
          채팅만
        </button>
        <button
          onClick={() => setViewMode("both")}
          className={`px-3 py-1 rounded-md border ${
            viewMode === "both"
              ? "bg-rose-200 border-rose-400"
              : "bg-white border-gray-300"
          }`}
        >
          둘 다
        </button>
      </div>

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
