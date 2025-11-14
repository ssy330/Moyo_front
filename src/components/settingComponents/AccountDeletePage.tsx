// AccountDeletePage.tsx
import { useState } from "react";
import DeleteAccountButton from "./DeleteAccountButton";

export default function AccountDeletePage() {
  const [confirmText, setConfirmText] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-green-600">계정 탈퇴</h2>

      <p className="mb-4 leading-relaxed text-gray-700">
        계정을 탈퇴하면 모든 개인 정보와 활동 내역이 영구적으로 삭제되며, 복구가
        불가능합니다. 탈퇴 전에 아래 내용을 반드시 확인해주세요.
      </p>

      <ul className="mb-6 list-disc space-y-2 pl-5 text-sm text-gray-600">
        <li>회원 정보, 그룹 활동 기록, 댓글 등 모든 데이터가 삭제됩니다.</li>
        <li>결제 이력이 있는 경우 환불은 불가합니다.</li>
        <li>동일 이메일로 재가입은 가능합니다.</li>
      </ul>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-4 w-4 accent-green-500"
        />
        <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
          위 내용을 모두 확인하였으며, 계정 탈퇴에 동의합니다.
        </label>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          아래 문구를 정확히 입력해주세요
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="탈퇴하겠습니다."
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
      </div>

      <DeleteAccountButton confirmed={agreed} confirmText={confirmText} />
    </div>
  );
}
