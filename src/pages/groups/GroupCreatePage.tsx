import GroupsCreateRadio from "@/components/GroupsPageComponents/GroupsCreateRadio";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 py-5">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow">
        {/* 사진 + 이름 */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
            사진
          </div>
          <input
            type="text"
            placeholder="모임 이름"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full rounded-md border border-neutral-300 p-2 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* 모임 가입 승인 설정 */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold">모임 가입 승인 설정</p>
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
          <p className="mb-2 text-sm font-semibold">실명 / 닉네임 여부</p>
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
          <p className="mb-2 text-sm font-semibold">모임 설명</p>
          <textarea
            placeholder="모임에 대한 설명을 입력하세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 w-full resize-none rounded-md border border-neutral-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            className="w-[48%]"
            disabled={approval === "auto"}
            onClick={() => alert("설문 폼 이동.!")}
          >
            가입폼 등록
          </Button>

          <Button
            className="w-[48%]"
            disabled={!isFormValid}
            onClick={handleCreate}
          >
            만들기
          </Button>
        </div>
      </div>
    </div>
  );
}
