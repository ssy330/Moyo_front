import { X, Camera, Video, Smile, ListChecks } from "lucide-react";

const WritePostModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 transition"
        >
          <X size={22} />
        </button>

        {/* 제목 */}
        <h2 className="text-xl font-bold mb-4 text-center">글쓰기</h2>

        {/* 입력 폼 */}
        <div className="space-y-3">
          <textarea
            placeholder="팀과 함께 나의 일상을 기록해보세요!"
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
