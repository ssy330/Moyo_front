// 로딩할 때 그룹 스켈레톤
export default function GroupLoader() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border bg-neutral-50">
          <div className="aspect-video bg-neutral-200" />
          <div className="p-4">
            <div className="h-4 w-2/3 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-1/3 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
