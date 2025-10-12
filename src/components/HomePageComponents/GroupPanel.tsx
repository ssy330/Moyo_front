type GroupPanelProps = {
  viewMode: "both" | "panel" | "chat";
};

const GroupPanel = ({ viewMode }: GroupPanelProps) => {
  return (
    <>
      <div
        className="relative flex-1 rounded-2xl border border-rose-400 bg-rose-50 shadow-sm
                     m-4 p-10 flex flex-col pb-16 overflow-y-auto min-h-[90vh]"
      >
        {/* 만들기, 참여하기 2개 */}
        <div
          className={`grid gap-8 ${
            viewMode === "both" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-4"
          }`}
        >
          {/* 만들기 */}
          <button
            type="button"
            className="w-full h-48 rounded-xl bg-white border border-gray-200 shadow-sm
                         flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
              +
            </div>
            <span className="text-gray-700 font-medium">만들기</span>
          </button>

          {/* 참여하기 */}
          <button
            type="button"
            className="w-full h-48 rounded-xl bg-white border border-gray-200 shadow-sm
                         flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
              +
            </div>
            <span className="text-gray-700 font-medium">참여하기</span>
          </button>
        </div>

        {/* 스크롤바 모형 */}
        <div className="absolute top-6 right-6 bottom-6 hidden md:flex items-center">
          <div className="w-[10px] h-full rounded-full bg-rose-100 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/3 w-[12px] h-[64px] rounded-full bg-rose-200" />
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupPanel;
