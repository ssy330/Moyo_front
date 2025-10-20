import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import StoryPost from "./StoryPost";
import StoryItem from "./StoryItem";
import StoryModal from "./StoryModal";

const StoryCarousel = () => {
  const [openStory, setOpenStory] = useState(false);
  const [openStoryPost, setOpenStoryPost] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);
  const totalAvatars = 35; // 전체 스토리 개수 (예시)
  const perPage = 7; // 한 화면에 보여줄 개수 (예시)
  const maxSlide = Math.ceil(totalAvatars / perPage) - 1;

  const avatars = Array.from({ length: totalAvatars }); //임시 스토리

  return (
    <>
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
            {/*  첫 번째: 내 스토리 */}
            <StoryItem
              isMine
              onStory={() => setOpenStory(true)}
              onStoryAdd={() => setOpenStoryPost(true)}
            />
            {/* 나머지 아바타들 */}
            {avatars.map((_, i) => (
              <StoryItem key={i} onStory={() => setOpenStory(true)} />
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

        {/* 스토리 작성 + 컴포넌트 */}
        <StoryPost
          isOpen={openStoryPost}
          onClose={() => setOpenStoryPost(false)}
        />

        {/* 스토리 컴포넌트 */}
        <StoryModal isOpen={openStory} onClose={() => setOpenStory(false)} />
      </div>
    </>
  );
};

export default StoryCarousel;
