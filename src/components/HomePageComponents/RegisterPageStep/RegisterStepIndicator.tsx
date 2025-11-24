type StepNumber = 1 | 2 | 3 | 4; // 이 파일 안에서만 쓸 타입
const TOTAL_STEPS: StepNumber = 4;

interface RegisterStepIndicatorProps {
  step: StepNumber;
}

export function RegisterStepIndicator({ step }: RegisterStepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {Array.from({ length: TOTAL_STEPS }, (_, idx) => {
        const current = (idx + 1) as StepNumber;
        const isActive = current === step;
        const isDone = current < step;

        return (
          <div key={current} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                isActive
                  ? "bg-emerald-500 text-white shadow-sm"
                  : isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {current}
            </div>

            {idx < TOTAL_STEPS - 1 && (
              <div
                className={`h-px w-6 sm:w-10 ${
                  isDone ? "bg-emerald-400" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
export default RegisterStepIndicator;
