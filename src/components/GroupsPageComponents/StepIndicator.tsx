export type Step = 1 | 2 | 3;

export default function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 1, label: "이름" },
    { id: 2, label: "이미지" },
    { id: 3, label: "설정" },
  ];

  return (
    <div className="flex items-center gap-2 text-xs whitespace-nowrap">
      {steps.map((s, idx) => {
        const active = s.id === step;
        const done = s.id < step;

        return (
          <div key={s.id} className="flex items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition ${
                active
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                  : done
                    ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                    : "border-neutral-300 bg-white text-neutral-500"
              }`}
            >
              {s.id}
            </div>
            <span
              className={`hidden text-[11px] whitespace-nowrap md:inline ${
                active
                  ? "text-emerald-600"
                  : done
                    ? "text-emerald-500"
                    : "text-neutral-400"
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className="h-px w-4 bg-neutral-300 md:w-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}
