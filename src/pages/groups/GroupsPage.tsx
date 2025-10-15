import { useState, useEffect, useRef } from "react";
import StoryCarousel from "@/components/GroupsComponents/StoryCarousel";
import GroupsLeftPanel from "@/components/GroupsComponents/GroupsLeftPanel";

export default function MoyoGroupLayout() {
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef(null);

  // outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!fabRef.current) return;
      if (!fabRef.current.contains(e.target)) setFabOpen(false);
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-[1200px] px-4 py-5">
        <div className="grid gap-10 md:grid-cols-[230px_1fr] items-stretch">
          {/* 왼쪽 패널 */}
          <GroupsLeftPanel />

          {/* 오른쪽 메인 */}
          <main className="space-y-4 mb-6 w-[600px]">
            <StoryCarousel />

            {/* 공지사항 */}
            <section className="rounded-md bg-neutral-200 px-5 py-5">
              <div className="text-lg font-semibold">공지 사항</div>
            </section>

            {/* 게시판 */}
            <section className="rounded-md bg-neutral-200 p-5 min-h-[420px]">
              <div className="mb-2 flex items-center justify-end gap-2 text-neutral-600">
                <div className="h-5 w-5 rounded-sm bg-neutral-300" />
                <div className="h-5 w-5 rounded-sm bg-neutral-300" />
              </div>
              <div className="pt-6 text-lg font-semibold bg-red-300">
                게시글
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* FAB */}
      <div ref={fabRef} className="fixed bottom-6 right-6">
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
