const ChattingPanel = () => {
  return (
    <>
      {/* 채팅 와이어프레임 */}

      <div className="m-4 flex h-[calc(90vh)] flex-col overflow-hidden overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
        {/* 윈도우 타이틀 바 */}
        <div className="flex h-10 shrink-0 items-center gap-2 bg-gray-50 px-3">
          <div className="h-3 w-3 rounded-full bg-red-300" />
          <div className="h-3 w-3 rounded-full bg-yellow-300" />
          <div className="h-3 w-3 rounded-full bg-green-300" />
        </div>

        <div className="flex flex-1">
          {/* 미니 사이드바 */}
          <div className="flex w-14 flex-col items-center gap-4 bg-gray-100 py-4">
            <div className="h-9 w-9 rounded-full bg-gray-300" />
            <div className="relative h-9 w-9 rounded bg-gray-300">
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-[10px] text-white">
                99+
              </div>
            </div>
            <div className="h-9 w-9 rounded bg-gray-300" />
            <div className="h-9 w-9 rounded bg-gray-300" />
            <div className="mt-auto h-6 w-6 rounded bg-gray-300" />
          </div>

          {/* 채팅 본문 */}
          <div className="flex flex-1 flex-col bg-gray-100">
            <div className="flex h-10 shrink-0 items-center gap-6 border-b bg-white px-4">
              <button className="h-6 w-12 cursor-pointer rounded hover:bg-gray-100">
                전체
              </button>
              <button className="h-6 w-12 cursor-pointer rounded hover:bg-gray-100">
                개인
              </button>
              <button className="h-6 w-12 cursor-pointer rounded hover:bg-gray-100">
                그룹
              </button>
            </div>
            <div className="flex-1 bg-gray-200" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChattingPanel;
