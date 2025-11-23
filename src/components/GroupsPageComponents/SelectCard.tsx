/**
 * 옵션 카드 (가입 승인 / 닉네임 등)
 */
type SelectCardProps = {
  title: string;
  description?: string;
  active: boolean;
  onClick: () => void;
};

export default function SelectCard({
  title,
  description,
  active,
  onClick,
}: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col rounded-2xl border p-3 text-left transition ${
        active
          ? "border-emerald-400 bg-white shadow-sm"
          : "border-neutral-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-900">{title}</span>
        {active && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
            ✓
          </span>
        )}
      </div>
      {description && <p className="text-xs text-neutral-500">{description}</p>}
    </button>
  );
}
