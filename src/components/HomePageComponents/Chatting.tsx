const Chatting = () => {
  return (
    <>
      {/* 채팅 와이어프레임 */}

      <div
        className="rounded-2xl bg-white shadow-lg border border-gray-200 m-4
                     overflow-hidden flex flex-col overflow-y-auto
                     h-[calc(90vh)]"
      >
        {/* 윈도우 타이틀 바 */}
        <div className="h-10 bg-gray-50 flex items-center gap-2 px-3 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-300" />
          <div className="w-3 h-3 rounded-full bg-yellow-300" />
          <div className="w-3 h-3 rounded-full bg-green-300" />
        </div>

        <div className="flex flex-1">
          {/* 미니 사이드바 */}
          <div className="w-14 bg-gray-100 flex flex-col items-center py-4 gap-4">
            <div className="w-9 h-9 rounded-full bg-gray-300" />
            <div className="relative w-9 h-9 rounded bg-gray-300">
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-400 text-white text-[10px] flex items-center justify-center">
                99+
              </div>
            </div>
            <div className="w-9 h-9 rounded bg-gray-300" />
            <div className="w-9 h-9 rounded bg-gray-300" />
            <div className="mt-auto w-6 h-6 rounded bg-gray-300" />
          </div>

          {/* 채팅 본문 */}
          <div className="flex-1 bg-gray-100 flex flex-col">
            <div className="h-10 bg-white flex items-center gap-6 px-4 border-b shrink-0">
              <div className="h-6 w-12 bg-gray-300 rounded" />
              <div className="h-6 w-12 bg-gray-300 rounded" />
              <div className="h-6 w-12 bg-gray-300 rounded" />
            </div>
            <div className="flex-1 bg-gray-200" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatting;
