import CloseButton from "../CloseButton";
import type { ModalProps } from "@/types/types";
import { useState } from "react";

const GroupJoinModal = ({ isOpen, onClose }: ModalProps) => {
  const [inviteCode, setInviteCode] = useState("");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose} />

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
          서버 참가하기
        </h2>

        {/* 안내 문구 */}
        <p className="text-center text-gray-600 text-sm mb-2">
          초대 코드를 입력하여 기존 서버에 참가하세요.
        </p>
        <p className="text-center text-gray-500 text-sm mb-6">
          초대 코드는 이렇게 생겼습니다:
          <br />
          <span className="text-blue-600">
            https://moyo.gg/invite/ <br />
          </span>
        </p>

        {/* 입력창 */}
        <div className="mb-6">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="여기에 초대 코드를 붙여 넣으세요"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">초대 코드를 입력하세요</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
          >
            취소
          </button>
          <button
            onClick={() => alert(`참여 코드: ${inviteCode}`)}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
          >
            참가
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupJoinModal;
