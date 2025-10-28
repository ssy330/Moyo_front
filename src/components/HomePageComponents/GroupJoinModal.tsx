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
        className="animate-fadeIn relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose} />

        {/* 제목 */}
        <h2 className="mb-4 text-center text-2xl font-bold text-green-700">
          서버 참가하기
        </h2>

        {/* 안내 문구 */}
        <p className="mb-2 text-center text-sm text-gray-600">
          초대 코드를 입력하여 기존 서버에 참가하세요.
        </p>
        <p className="mb-6 text-center text-sm text-gray-500">
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
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">초대 코드를 입력하세요</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-gray-600 transition hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={() => alert(`참여 코드: ${inviteCode}`)}
            className="rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            참가
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupJoinModal;
