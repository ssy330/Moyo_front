/**
 * 채팅과 그룹 보여주는 것 설정.
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
  { key: "panel", label: "패널만" },
  { key: "chat", label: "채팅만" },
  { key: "both", label: "둘 다" },
];

const ViewModeButtonGroup = ({
  value,
  onChange,
  options = defaultOptions,
}: Props) => {
  return (
    <div className="absolute top-4 right-10 flex items-center gap-3">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1 rounded-md border transition-colors
            ${
              value === key
                ? "bg-rose-200 border-rose-400"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ViewModeButtonGroup;
