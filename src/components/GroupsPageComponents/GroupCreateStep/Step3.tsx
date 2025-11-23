// src/components/GroupsPageComponents/Step3.tsx
import { Button } from "@/components/ui/button";
import SelectCard from "@/components/GroupsPageComponents/SelectCard";

type Step3Props = {
  approval: "auto" | "manual";
  setApproval: (value: "auto" | "manual") => void;
  nicknameAllowed: boolean;
  setNicknameAllowed: (value: boolean) => void;
  description: string;
  setDescription: (value: string) => void;
  isStep3Valid: boolean;
  onPrev: () => void;
  onSubmit: () => void;
  createGroupIsPending: boolean;
};

export default function Step3({
  approval,
  setApproval,
  nicknameAllowed,
  setNicknameAllowed,
  description,
  setDescription,
  isStep3Valid,
  onPrev,
  onSubmit,
  createGroupIsPending,
}: Step3Props) {
  return (
    <div className="mt-4">
      <h2 className="mb-3 text-lg font-semibold">
        그룹 내 설정을 마무리할게요
      </h2>
      <p className="mb-6 text-sm text-neutral-500">
        가입 승인 방식과 표기 방식을 선택하고, 모임에 대한 간단한 설명을
        적어주세요.
      </p>

      <div className="space-y-5">
        {/* 가입 승인 */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-3 text-sm font-semibold text-neutral-900">
            모임 가입 승인 설정
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectCard
              active={approval === "auto"}
              onClick={() => setApproval("auto")}
              title="바로 승인"
              description="신청 즉시 모임에 참여할 수 있어요."
            />
            <SelectCard
              active={approval === "manual"}
              onClick={() => setApproval("manual")}
              title="가입 승인 필요"
              description="운영자가 승인해야 모임에 들어올 수 있어요."
            />
          </div>
        </div>

        {/* 닉네임 / 실명 */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-3 text-sm font-semibold text-neutral-900">
            실명 / 닉네임 여부
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectCard
              active={!nicknameAllowed}
              onClick={() => setNicknameAllowed(false)}
              title="실명만 가능"
              description="회원들이 서로의 실명을 보고 활동해요."
            />
            <SelectCard
              active={nicknameAllowed}
              onClick={() => setNicknameAllowed(true)}
              title="닉네임만 가능"
              description="닉네임으로만 표시되어 조금 더 자유로워요."
            />
          </div>
        </div>

        {/* 설명 */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-2 text-sm font-semibold text-neutral-900">
            모임 설명
          </p>
          <textarea
            placeholder="모임에 대한 설명을 입력하세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 w-full resize-none rounded-xl border border-neutral-200 bg-white p-3 text-sm text-neutral-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          className="w-[48%] border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          onClick={onPrev}
        >
          이전
        </Button>

        <Button
          className="w-[48%] bg-emerald-500 font-semibold text-white hover:bg-emerald-400"
          disabled={!isStep3Valid}
          onClick={onSubmit}
        >
          {createGroupIsPending ? "만드는 중..." : "만들기"}
        </Button>
      </div>
    </div>
  );
}
