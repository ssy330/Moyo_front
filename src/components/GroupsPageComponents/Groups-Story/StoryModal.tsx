import CloseButton from "../../CloseButton";
import type { ModalProps } from "@/types/types";

//스토리 보는 컴포넌트
const StoryModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <div
        className="animate-fadeIn relative w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose} className="top-5 right-5" />
        <div>스토리 보는거 22</div>
      </div>
    </div>
  );
};

export default StoryModal;
