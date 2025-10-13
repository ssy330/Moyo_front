import { useState, useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import StoryCarousel from "@/components/GroupsComponents/StoryCarousel";

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
          <aside className="space-y-4 mt-[76px]">
            <div className="rounded-md bg-neutral-200 p-4 relative">
              {/* 커버사진 영역 */}
              <div className="aspect-[4/3] w-full rounded bg-neutral-300 relative overflow-hidden">
                {/* ⚙️ Settings 아이콘 */}
                <button
                  className="absolute bottom-3 right-3 text-neutral-600 opacity-60 hover:opacity-100 hover:text-neutral-800 transition"
                  aria-label="그룹 관리"
                >
                  <Settings size={22} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className="rounded-md bg-white p-4 shadow-sm space-y-2">
              <div className="text-xl font-extrabold tracking-tight">
                GROUP 이름
              </div>
              <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
                여기는 그룹 소개가 들어가는 영역입니다.
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                <span className="rounded bg-neutral-100 px-2 py-1">
                  멤버: 93,128명
                </span>
                <span className="rounded bg-neutral-100 px-2 py-1">
                  초대코드
                </span>
              </div>
            </div>

            {/* 그룹 관리 버튼 - 커버사진 카드 내부 오른쪽 상단 */}

            <div className="rounded-md bg-white p-4 shadow-sm text-center">
              <button className="flex-1 text-xl font-semibold cursor-pointer">
                게시판 글 작성
              </button>
            </div>
            <div className="mt-3 rounded bg-neutral-100 p-6 text-center text-sm text-neutral-500">
              게시판 나누기 (카테고리)
            </div>
          </aside>

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
