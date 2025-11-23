import { Button } from "@/components/ui/button";

type Step1Props = {
  groupName: string;
  setGroupName: (value: string) => void;
  privacy: boolean;
  setPrivacy: (value: boolean) => void;
  isStep1Valid: boolean;
  onNext: () => void;
};

export default function Step1({
  groupName,
  setGroupName,
  privacy,
  setPrivacy,
  isStep1Valid,
  onNext,
}: Step1Props) {
  return (
    <div className="mt-4">
      <h2 className="mb-3 text-lg font-semibold">
        모임 이름을 지정하여 시작하기
      </h2>
      <p className="mb-6 text-sm text-neutral-500">
        나중에 언제든지 변경할 수 있어요. 사람들이 한 눈에 이해할 수 있는
        이름이면 더 좋아요.
      </p>

      <input
        type="text"
        placeholder="모임 이름 입력"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full rounded-xl border border-emerald-300 bg-white p-4 text-base text-neutral-900 shadow-sm transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
      />

      {/* 개인정보 동의 */}
      <div className="mt-4 flex items-start gap-2 text-sm text-neutral-600">
        <input
          id="privacy"
          type="checkbox"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-neutral-400 text-emerald-600 focus:ring-emerald-400"
        />
        <label htmlFor="privacy" className="cursor-pointer leading-snug">
          <span className="font-semibold text-neutral-900">
            개인정보의 수집 및 이용(필수)
          </span>
          <br />
          Moyo가 서비스 제공 및 향상을 위해 개인정보를 수집 및 이용합니다.
        </label>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          className="w-32 bg-emerald-500 font-semibold text-white hover:bg-emerald-400"
          disabled={!isStep1Valid}
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
