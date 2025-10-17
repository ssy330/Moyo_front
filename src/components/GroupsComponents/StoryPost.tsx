import CloseButton from "../CloseButton";
import type { ModalProps } from "@/types/types";

const StoryPost = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn border border-emerald-100">
        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
};

export default StoryPost;
