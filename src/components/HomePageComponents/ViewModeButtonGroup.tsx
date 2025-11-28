type ViewMode = "both" | "panel" | "chat";

interface ButtonOption {
  key: ViewMode;
  label: string;
}

interface Props {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  options?: ButtonOption[];
}

const defaultOptions: ButtonOption[] = [
  { key: "panel", label: "패널" },
  { key: "chat", label: "채팅" },
  { key: "both", label: "모두" },
];

export default function ViewModeButtonGroup({
  value,
  onChange,
  options = defaultOptions,
}: Props) {
  return (
    <div className="border-border bg-card/80 mt-2 mr-7 flex items-center rounded-full border shadow-sm backdrop-blur-md">
      {options.map(({ key, label }) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "from-primary to-primary/80 text-primary-foreground bg-linear-to-r shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
