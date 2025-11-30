// src/components/modal/ScheduleCreateModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScheduleCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;
  startAt: string;
  endAt: string;
  allDay: boolean;

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setStartAt: (v: string) => void;
  setEndAt: (v: string) => void;
  setAllDay: (v: boolean) => void;

  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ScheduleCreateModal({
  open,
  onOpenChange,
  title,
  description,
  startAt,
  endAt,
  allDay,
  setTitle,
  setDescription,
  setStartAt,
  setEndAt,
  setAllDay,
  onSubmit,
  isSubmitting,
}: ScheduleCreateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 일정 추가</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">제목</label>
            <input
              className="w-full rounded border px-2 py-1 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 캡스톤 회의"
            />
          </div>

          <div
            className={`grid grid-cols-1 gap-2 ${allDay ? "" : "md:grid-cols-2"}`}
          >
            <div className="space-y-1">
              <label className="text-sm font-medium">시작</label>
              <input
                type="date"
                className="w-full rounded border px-2 py-1 text-sm"
                value={startAt}
                onChange={(e) => {
                  const value = e.target.value;
                  setStartAt(value);
                  if (allDay) {
                    setEndAt(value);
                  }
                }}
              />
            </div>

            {/* ✅ 종일 일정이 아닐 때만 종료일 입력 노출 */}
            {!allDay && (
              <div className="space-y-1">
                <label className="text-sm font-medium">종료</label>
                <input
                  type="date"
                  className="w-full rounded border px-2 py-1 text-sm"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="allDay"
              type="checkbox"
              checked={allDay}
              onChange={(e) => {
                const checked = e.target.checked;
                setAllDay(checked);
                // 종일 일정으로 바꿀 때는 종료일을 시작일과 맞춰줌
                if (checked && startAt) {
                  setEndAt(startAt);
                }
              }}
            />
            <label htmlFor="allDay" className="text-sm">
              종일 일정
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">메모</label>
            <textarea
              className="w-full resize-none rounded border px-2 py-1 text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="간단한 설명을 적어주세요."
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md border px-3 py-1 text-sm"
            onClick={() => onOpenChange(false)}
          >
            취소
          </button>
          <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-sm disabled:opacity-60"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
