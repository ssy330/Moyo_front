import type { ModalProps } from "@/types/types";
import CloseButton from "../CloseButton";
import { Copy } from "lucide-react";
import { useState, useEffect } from "react";

const InviteCodeModal = ({ isOpen, onClose }: ModalProps) => {
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    const random = Math.random().toString(36).slice(2, 10);
    setInviteCode(`https://moyo.gg/invite/${random}`);
  }, []);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      alert("초대 링크가 복사되었습니다! 🌿");
    } catch {
      alert("복사에 실패했어요 😢 다시 시도해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn border border-emerald-100">
        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose} />

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-center text-emerald-600 mb-5">
          초대코드 공유
        </h2>

        {/* 링크 박스 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <span className="text-sm text-emerald-800 truncate">
            {inviteCode || "생성 중..."}
          </span>
          <button
            onClick={handleCopy}
            className="ml-3 bg-pink-300 hover:bg-pink-400 text-white text-sm px-4 py-1.5 rounded-md font-semibold transition shadow-sm"
          >
            <Copy />
          </button>
        </div>

        {/* 안내 문구 */}
        <p className="mt-3 text-xs text-center text-neutral-500">
          초대 링크는{" "}
          <span className="text-emerald-600 font-medium">7일 후 만료</span>돼요.
        </p>
      </div>
    </div>
  );
};

export default InviteCodeModal;
