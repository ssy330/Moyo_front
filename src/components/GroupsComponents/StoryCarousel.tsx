import { ChevronLeft, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";

const StoryCarousel = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const totalAvatars = 14; // 전체 스토리 개수 (예시)
  const perPage = 7; // 한 화면에 보여줄 개수 (예시)
  const maxSlide = Math.ceil(totalAvatars / perPage) - 1;

  const avatars = Array.from({ length: totalAvatars }); //임시 스토리

  return (
    <>
      {/* 스토리 영역 - 공지사항과 같은 너비 */}
      {/* 🔹 스토리 영역 */}
      <div className="relative w-full max-w-[600px] mx-auto mb-5">
        {/* 왼쪽 화살표 */}
        {slideIndex > 0 && (
          <button
            onClick={() => setSlideIndex((i) => i - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-neutral-100"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-700" />
          </button>
        )}

        {/* 스크롤 가능한 스토리 리스트 */}
        <div className="overflow-hidden w-full px-3">
          <div
            className="flex gap-3 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${slideIndex * 50}%)`,
              width: `${(totalAvatars / perPage) * 100}%`,
            }}
          >
            {/* ✅ 첫 번째: 내 스토리 */}
            <div className="relative h-14 w-14 shrink-0 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 p-[2px]">
              <div className="h-full w-full rounded-full bg-white p-[2px] relative">
                <div className="h-full w-full rounded-full bg-neutral-300" />
                {/* + 버튼 */}
                <button className="absolute bottom-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition">
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* 나머지 아바타들 */}
            {avatars.map((_, i) => (
              <div
                key={i}
                className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 p-[2px]"
              >
                <div className="h-full w-full rounded-full bg-white p-[2px]">
                  <div className="h-full w-full rounded-full bg-neutral-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 화살표 */}
        {slideIndex < maxSlide && (
          <button
            onClick={() => setSlideIndex((i) => i + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-neutral-100"
          >
            <ChevronRight className="w-5 h-5 text-neutral-700" />
          </button>
        )}
      </div>
    </>
  );
};

export default StoryCarousel;
