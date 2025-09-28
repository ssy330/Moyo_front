import { useState, useEffect, useRef } from "react";

export default function MoyoGroupLayout() {
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef(null);

  // close on outside click
  useEffect(() => {
    function handle(e) {
      if (!fabRef.current) return;
      if (!fabRef.current.contains(e.target)) setFabOpen(false);
    }
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* App Shell */}
      <div className="mx-auto max-w-[1200px] px-4 py-5">
        {/* Top bar */}
        <div className="flex items-center gap-4">

          {/* Avatars row */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto py-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-12 w-12 shrink-0 rounded-full bg-neutral-300" />
            ))}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2">
            <input
              placeholder="검색"
              className="h-9 w-[280px] rounded-full border border-rose-200/80 px-3 outline-none focus:border-rose-300 bg-white"
            />
          </div>
        </div>

        {/* Content area */}
        <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Left rail */}
          <aside className="space-y-4">
            {/* 그룹 관리 버튼 (pill) */}
            <button className="w-fit rounded-full bg-rose-100 px-4 py-2 text-sm font-medium hover:bg-rose-200 transition">
              그룹 관리
            </button>

            {/* 커버 사진 placeholder */}
            <div className="rounded-md bg-neutral-200 p-4">
              <div className="aspect-[4/3] w-full rounded bg-neutral-300" />
              <div className="mt-3 text-lg font-semibold">커버 사진</div>
            </div>

            {/* 그룹 카드 */}
            <div className="rounded-md bg-white p-4 shadow-sm">
              <div className="text-xl font-extrabold tracking-tight">GROUP</div>
              <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
                여기는 그룹 소개가 들어가는 영역입니다.
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                <span className="rounded bg-neutral-100 px-2 py-1">멤버: 93,128명</span>
                <span className="rounded bg-neutral-100 px-2 py-1">초대코드</span>
              </div>
            </div>

            {/* 글쓰기 카드 */}
            <div className="rounded-md bg-white p-4 shadow-sm">
              <div className="text-xl font-semibold">글쓰기</div>
              <div className="mt-3 rounded bg-neutral-100 p-6 text-center text-sm text-neutral-500">
                게시판 나누기 (카테고리)
              </div>
            </div>
          </aside>

          {/* Main column */}
          <main className="space-y-4">
            {/* 공지 사항 */}
            <section className="rounded-md bg-neutral-200 px-5 py-5">
              <div className="text-lg font-semibold">공지 사항</div>
            </section>

            {/* 게시글 영역 */}
            <section className="rounded-md bg-neutral-200 p-5 min-h-[420px]">
              <div className="mb-2 flex items-center justify-end gap-2 text-neutral-600">
                <div className="h-5 w-5 rounded-sm bg-neutral-300" />
                <div className="h-5 w-5 rounded-sm bg-neutral-300" />
              </div>
              <div className="pt-6 text-lg font-semibold">게시글</div>
            </section>
          </main>
        </div>
      </div>

      {/* Floating FAB bottom-right */}
      <div ref={fabRef} className="fixed bottom-6 right-6">
        {/* Menu */}
        {fabOpen && (
          <div className="mb-3 w-36 rounded-xl border bg-white p-2 shadow-xl">
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-neutral-100">
              사진첩
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-neutral-100">
              캘린더
            </button>
          </div>
        )}

        {/* Ellipsis button */}
        <button
          aria-label="더보기"
          onClick={() => setFabOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-neutral-200 hover:shadow-2xl"
        >
          <span className="text-2xl leading-none">…</span>
        </button>
      </div>
    </div>
  );
}
