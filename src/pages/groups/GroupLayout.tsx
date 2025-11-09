import { useState, useEffect, useRef } from "react";
import GroupsLeftPanel from "@/components/GroupsPageComponents/GroupsLeftPanel";
import { Plus } from "lucide-react";
import PostFeed from "@/components/GroupsPageComponents/post-feed";

export default function MoyoGroupLayout() {
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  // ✅ 외부 클릭 시 FAB 닫기
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!fabRef.current?.contains(e.target as Node)) setFabOpen(false);
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  return (
    <div className="min-h-screen text-neutral-900">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          {/* 왼쪽 패널 */}
          <GroupsLeftPanel />

          {/* 오른쪽 메인 */}
          <main className="w-full max-w-[680px] space-y-6">
            {/* ✅ 세로형 스토리 */}

            {/* 공지사항 */}
            <section className="rounded-2xl bg-white/70 px-6 py-5 shadow-sm backdrop-blur">
              <h2 className="mb-2 text-lg font-semibold text-neutral-800">
                공지 사항
              </h2>
              <p className="text-sm text-neutral-600">
                아직 등록된 공지사항이 없습니다.
              </p>
            </section>

            {/* 게시판 */}
            <section className="min-h-[420px] rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-800">게시글</h2>
                <div className="flex gap-2">
                  <div className="h-5 w-5 rounded-md bg-neutral-200" />
                  <div className="h-5 w-5 rounded-md bg-neutral-200" />
                </div>
              </div>

              <PostFeed />
            </section>
          </main>
        </div>
      </div>

      {/* ✅ FAB */}
      <div ref={fabRef} className="fixed right-6 bottom-6">
        {fabOpen && (
          <div className="animate-fadeIn mb-3 w-40 rounded-xl border border-neutral-200 bg-white shadow-xl">
            <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100">
              📸 사진첩
            </button>
            <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100">
              📅 캘린더
            </button>
          </div>
        )}

        <button
          aria-label="메뉴 열기"
          onClick={() => setFabOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
