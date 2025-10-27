import { useState } from "react";

export default function GroupCreatePage() {
  const [approval, setApproval] = useState("auto");
  const [nicknameAllowed, setNicknameAllowed] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 py-5">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-6">
        {/* 사진 + 이름 */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-neutral-200 mb-3 flex items-center justify-center text-neutral-500">
            사진
          </div>
          <input
            type="text"
            placeholder="모임 이름"
            className="w-full text-center border border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 모임 가입 승인 설정 */}
        <div className="mb-6">
          <p className="font-semibold text-sm mb-2">모임 가입 승인 설정</p>
          <div className="flex gap-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="approval"
                value="auto"
                checked={approval === "auto"}
                onChange={(e) => setApproval(e.target.value)}
              />
              <span>바로 승인</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="approval"
                value="manual"
                checked={approval === "manual"}
                onChange={(e) => setApproval(e.target.value)}
              />
              <span>가입 승인</span>
            </label>
          </div>
        </div>

        {/* 실명 / 닉네임 여부 */}
        <div className="mb-6">
          <p className="font-semibold text-sm mb-2">실명 / 닉네임 여부</p>
          <div className="flex gap-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="nickname"
                value="real"
                checked={!nicknameAllowed}
                onChange={() => setNicknameAllowed(false)}
              />
              <span>실명만 가능</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="nickname"
                value="nick"
                checked={nicknameAllowed}
                onChange={() => setNicknameAllowed(true)}
              />
              <span>닉네임 가능</span>
            </label>
          </div>
        </div>

        {/* 모임 설명 */}
        <div className="mb-6">
          <p className="font-semibold text-sm mb-2">모임 설명</p>
          <textarea
            placeholder="모임에 대한 설명을 입력하세요."
            className="w-full border border-neutral-300 rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 개인정보 동의 */}
        <div className="mb-6 flex items-start gap-3 text-sm text-neutral-700">
          <input
            id="privacy"
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="privacy">
            <strong>개인정보의 수집 및 이용(필수)</strong>
            <br />
            Moyo가 서비스 제공 및 향상을 위해 개인정보를 수집 및 이용합니다.
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex justify-between mt-8">
          <button className="w-[48%] py-2 border border-neutral-300 rounded-md hover:bg-neutral-100 transition">
            가입폼 등록
          </button>
          <button className="w-[48%] py-2 bg-green-300 rounded-md hover:bg-green-400 transition">
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}
