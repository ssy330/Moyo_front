// src/components/modal/ScheduleEditModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type ScheduleEditModalProps = {
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

  onDelete: () => void;
  onSubmit: () => void;
  isDeleting: boolean;
  isSubmitting: boolean;
};

export default function ScheduleEditModal({
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
  onDelete,
  onSubmit,
  isDeleting,
  isSubmitting,
}: ScheduleEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>일정 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">제목</label>
            <input
              className="w-full rounded border px-2 py-1 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">시작</label>
              <input
                type="date"
                className="w-full rounded border px-2 py-1 text-sm"
                value={startAt}
                onChange={(e) => {
                  const value = e.target.value;
                  setStartAt(value);
                  // 종일 일정이면 종료일도 자동으로 같은 날로
                  if (allDay) {
                    setEndAt(value);
                  }
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">종료</label>
              <input
                type="date"
                className="w-full rounded border px-2 py-1 text-sm"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="edit-allDay"
              type="checkbox"
              checked={allDay}
              onChange={(e) => {
                const checked = e.target.checked;
                setAllDay(checked);
                if (checked && startAt) {
                  setEndAt(startAt);
                }
              }}
            />
            <label htmlFor="edit-allDay" className="text-sm">
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
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between gap-2">
          <button
            type="button"
            className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm"
              onClick={() => onOpenChange(false)}
            >
              닫기
            </button>
            <button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-sm disabled:opacity-60"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "수정 중..." : "수정 저장"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
