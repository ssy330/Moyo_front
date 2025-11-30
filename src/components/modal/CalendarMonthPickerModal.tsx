import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader as UiDialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CalendarMonthPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseDate: Date;
  onChangeBaseDate: (date: Date) => void;
  onToday: () => void;
}

const formatMonthInput = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // YYYY-MM
};

export function CalendarMonthPickerModal({
  open,
  onOpenChange,
  baseDate,
  onChangeBaseDate,
  onToday,
}: CalendarMonthPickerModalProps) {
  const [monthInput, setMonthInput] = useState<string>("");

  // 열릴 때마다 현재 baseDate 기준으로 input 초기화
  useEffect(() => {
    if (open) {
      setMonthInput(formatMonthInput(baseDate));
    }
  }, [open, baseDate]);

  const handleApplyMonth = () => {
    if (!monthInput) {
      alert("이동할 연/월을 선택해주세요.");
      return;
    }

    const [yearStr, monthStr] = monthInput.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (!year || !month) {
      alert("연/월 형식이 올바르지 않습니다.");
      return;
    }

    const newDate = new Date(year, month - 1, 1);
    onChangeBaseDate(newDate);
    onOpenChange(false);
  };

  const handleGoToday = () => {
    onToday();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <UiDialogHeader>
          <DialogTitle>다른 달로 이동</DialogTitle>
        </UiDialogHeader>

        <div className="space-y-3 py-2">
          <label className="text-foreground text-sm font-medium">
            이동할 연/월 선택
          </label>
          <input
            type="month"
            value={monthInput}
            onChange={(e) => setMonthInput(e.target.value)}
            className="border-input bg-background text-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none"
          />
          <p className="text-muted-foreground text-xs">
            선택한 연/월의 1일을 기준으로 달력이 이동합니다.
          </p>
        </div>

        {/* 오늘은 왼쪽, 취소/이동은 오른쪽 끝 */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="border-input bg-background text-foreground hover:bg-accent/60 inline-flex items-center rounded-md border px-3 py-1.5 text-sm"
            onClick={handleGoToday}
          >
            오늘
          </button>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="border-input bg-background text-muted-foreground hover:bg-accent/60 inline-flex items-center rounded-md border px-3 py-1.5 text-sm"
              onClick={() => onOpenChange(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium"
              onClick={handleApplyMonth}
            >
              이동
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
