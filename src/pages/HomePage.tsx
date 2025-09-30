// src/pages/HomePage.tsx
import React from "react";

const HomePage = () => {
  return (
    <div className="flex gap-6 items-start">
      {/* 모임 패널*/}
      <section className="flex-1 flex">
        <div
          className="relative flex-1 rounded-2xl border border-rose-400 bg-rose-50 shadow-sm
                     m-4 p-10 flex flex-col pb-16 overflow-y-auto min-h-[95vh]"
        >
          {/* 만들기, 참여하기 2개 */}
          <div className="grid grid-cols-2 gap-8">
            {/* 만들기 */}
            <button
              type="button"
              className="w-full h-48 rounded-xl bg-white border border-gray-200 shadow-sm
                         flex flex-col items-center justify-center gap-3 hover:shadow-md transition"
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
                         flex flex-col items-center justify-center gap-3 hover:shadow-md transition"
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
      </section>

      {/* 채팅 와이어프레임 */}
      <aside className="w-[420px] lg:w-[450px] shrink-0 self-start ">
        <div
          className="rounded-2xl bg-white shadow-lg border border-gray-200 m-4
                     overflow-hidden flex flex-col overflow-y-auto
                     h-[calc(100vh-160px)] mb-20"
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
      </aside>
    </div>
  );
};

export default HomePage;
