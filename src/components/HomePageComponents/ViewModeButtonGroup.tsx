/**
 * ViewModeButtonGroup.tsx
 *
 * - 상단 오른쪽에 떠 있는 뷰모드 전환 버튼 (패널 / 채팅 / 둘다)
 * - pill 스타일로 개선 (라운드, 그라데이션, 부드러운 hover)
 */
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
    <div className="mt-2 mr-7 flex items-center rounded-full border border-neutral-200 bg-white/80 shadow-sm backdrop-blur-md">
      {options.map(({ key, label }) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`relative px-5 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
            } rounded-full`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
