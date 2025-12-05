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
      <p className="text-muted-foreground mb-6 text-sm">
        나중에 언제든지 변경할 수 있어요. 사람들이 한 눈에 이해할 수 있는
        이름이면 더 좋아요.
      </p>

      <input
        type="text"
        placeholder="예: 강남대 프로젝트 모임"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="border-input bg-background focus:border-primary focus:ring-primary/30 w-full rounded-2xl border-2 px-5 py-4 text-lg font-semibold shadow-sm transition outline-none placeholder:text-lg placeholder:font-semibold placeholder:text-neutral-400 focus:ring-2"
      />

      {/* 개인정보 동의 */}
      <div className="text-muted-foreground mt-4 flex items-start gap-2 text-sm">
        <input
          id="privacy"
          type="checkbox"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
          className="border-input bg-background text-primary accent-primary focus-visible:ring-primary/40 mt-1 h-4 w-4 rounded focus-visible:ring-2 focus-visible:outline-none"
        />
        <label htmlFor="privacy" className="cursor-pointer leading-snug">
          <span className="text-foreground font-semibold">
            개인정보의 수집 및 이용(필수)
          </span>
          <br />
          Moyo가 서비스 제공 및 향상을 위해 개인정보를 수집 및 이용합니다.
        </label>
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="w-32" disabled={!isStep1Valid} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
