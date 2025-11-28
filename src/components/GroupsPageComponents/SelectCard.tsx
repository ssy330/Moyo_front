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
          ? "border-primary bg-card shadow-sm"
          : "border-border bg-card hover:border-primary/60 hover:bg-muted"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-foreground text-sm font-medium">{title}</span>
        {active && (
          <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold">
            ✓
          </span>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
    </button>
  );
}
