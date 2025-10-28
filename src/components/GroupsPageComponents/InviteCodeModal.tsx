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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fadeIn relative w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose} />

        {/* 제목 */}
        <h2 className="mb-5 text-center text-2xl font-bold text-emerald-600">
          초대코드 공유
        </h2>

        {/* 링크 박스 */}
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <span className="truncate text-sm text-emerald-800">
            {inviteCode || "생성 중..."}
          </span>
          <button
            onClick={handleCopy}
            className="ml-3 rounded-md bg-pink-300 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-400"
          >
            <Copy />
          </button>
        </div>

        {/* 안내 문구 */}
        <p className="mt-3 text-center text-xs text-neutral-500">
          초대 링크는{" "}
          <span className="font-medium text-emerald-600">7일 후 만료</span>돼요.
        </p>
      </div>
    </div>
  );
};

export default InviteCodeModal;
