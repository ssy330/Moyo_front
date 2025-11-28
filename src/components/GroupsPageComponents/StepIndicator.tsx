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
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : done
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
              }`}
            >
              {s.id}
            </div>
            <span
              className={`hidden text-[11px] whitespace-nowrap md:inline ${
                active
                  ? "text-primary"
                  : done
                    ? "text-primary/80"
                    : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className="bg-border h-px w-4 md:w-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}
