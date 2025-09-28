// src/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function SidebarNav() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r bg-rose-50/60">
      <div className="flex items-center justify-center pt-4 pb-6">
        <img src="/Moyo_logo.png" alt="moyo" className="h-9 w-9 rounded-2xl object-cover" />
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
  );
}

export default function AppLayout() {
  // (필요시) 우하단 … FAB 로직은 여기 두고, 자식 페이지는 UI만
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = fabRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setFabOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <SidebarNav />
      {/* 사이드바 폭만큼 본문 밀기 */}
      <div className="pl-16">
        <Outlet />
      </div>

      {/* (선택) 공통 FAB */}
      <div ref={fabRef} className="fixed bottom-6 right-6">
        {fabOpen && (
          <div className="mb-3 w-36 rounded-xl border bg-white p-2 shadow-xl">
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-neutral-100">사진첩</button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-neutral-100">캘린더</button>
          </div>
        )}
        <button
          aria-label="더보기"
          onClick={() => setFabOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-neutral-200"
        >
          <span className="text-2xl leading-none">…</span>
        </button>
      </div>
    </div>
  );
}
