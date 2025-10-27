import GroupsCreateRadio from "@/components/GroupsPageComponents/GroupsCreateRadio";
import { useState } from "react";

export default function GroupCreatePage() {
  const [approval, setApproval] = useState("auto");
  const [nicknameAllowed, setNicknameAllowed] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  // ✅ 모든 조건이 충족될 때만 다음 버튼 활성화
  const isFormValid =
    groupName.trim() !== "" && description.trim() !== "" && privacy === true;

  const handleCreate = () => {
    if (!isFormValid) return;

    // 임시
    const info = `
      📌 모임 생성 정보

      모임 이름: ${groupName}
      가입 승인 방식: ${approval === "auto" ? "바로 승인" : "가입 승인 필요"}
      닉네임 사용: ${nicknameAllowed ? "닉네임 가능" : "실명만 가능"}
      모임 설명: ${description}
      개인정보 동의: ${privacy ? "동의함 ✅" : "미동의 ❌"}
    `;

    alert(info);
  };

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
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full text-center border border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 모임 가입 승인 설정 */}
        <div className="mb-6">
          <p className="font-semibold text-sm mb-2">모임 가입 승인 설정</p>
          <div className="flex gap-6">
            <GroupsCreateRadio
              name="approval"
              value="auto"
              checked={approval === "auto"}
              onChange={(e) => setApproval(e.target.value)}
              title={"바로 승인"}
            />
            <GroupsCreateRadio
              name="approval"
              value="manual"
              checked={approval === "manual"}
              onChange={(e) => setApproval(e.target.value)}
              title="가입 승인"
            />
          </div>
        </div>

        {/* 실명 / 닉네임 여부 */}
        <div className="mb-6">
          <p className="font-semibold text-sm mb-2">실명 / 닉네임 여부</p>
          <div className="flex gap-6">
            <GroupsCreateRadio
              name="nickname"
              value="real"
              checked={!nicknameAllowed}
              onChange={() => setNicknameAllowed(false)}
              title="실명만 가능"
            />
            <GroupsCreateRadio
              name="nickname"
              value="nick"
              checked={nicknameAllowed}
              onChange={() => setNicknameAllowed(true)}
              title="닉네임만 가능"
            />
          </div>
        </div>

        {/* 모임 설명 */}
        <div className="mb-6">
          <p className="font-semibold text-sm mb-2">모임 설명</p>
          <textarea
            placeholder="모임에 대한 설명을 입력하세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <button
            onClick={handleCreate}
            disabled={!isFormValid}
            className={`w-[48%] py-2 rounded-md transition ${
              isFormValid
                ? "bg-green-400 hover:bg-green-500 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}
