import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex">
      {/* 사이드바 */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r bg-rose-50/60">
        <div className="flex items-center justify-center pt-4 pb-6">
          <img
            src="/Moyo_logo.png"
            alt="moyo"
            className="h-9 w-9 rounded-2xl object-cover"
          />
        </div>
        <nav className="flex flex-col items-center gap-4">
          <button className="rounded-xl p-2 hover:bg-white/70">
            <span className="inline-block h-7 w-7 rounded-lg bg-sky-200" />
          </button>
          <button className="rounded-xl p-2 hover:bg-white/70">
            <span className="inline-block h-7 w-7 rounded-lg bg-yellow-300" />
          </button>
          <button className="rounded-xl p-2 hover:bg-white/70">
            <span className="inline-block h-7 w-7 rounded-lg bg-rose-200" />
          </button>
        </nav>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button className="rounded-xl p-2 hover:bg-white/70">
            <span className="inline-block h-7 w-7 rounded-full bg-neutral-200" />
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="ml-16 flex-1 bg-gray-50 min-h-screen">
        <Outlet /> {/* ✅ 여기에 자식 라우트(HomePage 등)가 렌더링됨 */}
      </main>
    </div>
  );
};

export default AppLayout;
