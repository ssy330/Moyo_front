/**
 * 그룹 만들 때, 입력 폼
 */
import { Camera, Video, Smile, ListChecks } from "lucide-react";
import type { ModalProps } from "@/types/types";
import CloseButton from "../CloseButton";

const WritePostModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose} />

        {/* 제목 */}
        <h2 className="text-xl font-bold mb-4 text-center">글쓰기</h2>

        {/* 입력 폼 */}
        <div className="space-y-3">
          <textarea
            placeholder="그룹 내 인원들과 나의 일상을 공유해보세요!"
            className="w-full border border-neutral-300 rounded-lg px-3 py-3 h-50 resize-none focus:outline-none focus:ring-1 focus:ring-neutral-400 text-[15px] leading-relaxed"
          />
        </div>

        {/* 아이콘 / 옵션 영역 */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex gap-4 text-neutral-500">
            {[Camera, Video, Smile, ListChecks].map((Icon, idx) => (
              <button
                key={idx}
                className="hover:text-neutral-800 transition-transform hover:scale-110"
              >
                <Icon size={21} strokeWidth={1.8} />
              </button>
            ))}
          </div>
          <button className="bg-neutral-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-neutral-700 transition">
            게시
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritePostModal;
