import CloseButton from "../../CloseButton";
import type { ModalProps } from "@/types/types";

const StoryPost = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose} />
        <div>스토리 작성</div>
      </div>
    </div>
  );
};

export default StoryPost;
