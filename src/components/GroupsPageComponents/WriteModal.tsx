/**
 * 그룹 만들 때, 입력 폼
 */
import { Camera, Video, Smile, ListChecks, X } from "lucide-react";
import type { ModalProps } from "@/types/types";

const WritePostModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fadeIn relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 rounded-full p-1 text-neutral-500 hover:bg-neutral-100"
        >
          <X size={18} />
        </button>

        {/* 제목 */}
        <h2 className="mb-4 text-center text-xl font-bold">글쓰기</h2>

        {/* 입력 폼 */}
        <div className="space-y-3">
          <textarea
            placeholder="그룹 내 인원들과 나의 일상을 공유해보세요!"
            className="h-50 w-full resize-none rounded-lg border border-neutral-300 px-3 py-3 text-[15px] leading-relaxed focus:ring-1 focus:ring-neutral-400 focus:outline-none"
          />
        </div>

        {/* 아이콘 / 옵션 영역 */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-4 text-neutral-500">
            {[Camera, Video, Smile, ListChecks].map((Icon, idx) => (
              <button
                key={idx}
                className="transition-transform hover:scale-110 hover:text-neutral-800"
              >
                <Icon size={21} strokeWidth={1.8} />
              </button>
            ))}
          </div>
          <button className="rounded-lg bg-neutral-800 px-5 py-2 font-medium text-white transition hover:bg-neutral-700">
            게시
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritePostModal;
