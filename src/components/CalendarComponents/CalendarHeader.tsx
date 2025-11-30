import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader as UiDialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ViewFilter = "all" | "personal" | "group";

interface CalendarHeaderProps {
  viewFilter: ViewFilter;
  onChangeViewFilter: (filter: ViewFilter) => void;
  myGroups: { id: number; name: string }[] | undefined;
  selectedGroupId: number | null;
  onChangeGroupId: (id: number | null) => void;

  monthLabel: string;
  baseDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onChangeBaseDate: (date: Date) => void;

  onClickAdd: () => void;
  addDisabled: boolean;

  monthEventCount: number;
  multiDayEventCount: number;

  ownerName?: string;
}

export function CalendarHeader({
  viewFilter,
  onChangeViewFilter,
  myGroups,
  selectedGroupId,
  onChangeGroupId,
  monthLabel,
  baseDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onChangeBaseDate,
  onClickAdd,
  addDisabled,
  monthEventCount,
  multiDayEventCount,
  ownerName,
}: CalendarHeaderProps) {
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [monthInput, setMonthInput] = useState<string>("");

  const formatMonthInput = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`; // YYYY-MM
  };

  const handleOpenMonthPicker = () => {
    setMonthInput(formatMonthInput(baseDate));
    setIsMonthPickerOpen(true);
  };

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
    setIsMonthPickerOpen(false);
  };

  const handleGoToday = () => {
    onToday();
    setIsMonthPickerOpen(false);
  };

  const titleText = ownerName ? `${ownerName}님의 캘린더` : "캘린더";

  return (
    <header className="bg-card/70 mx-auto w-full max-w-4xl rounded-2xl px-4 py-3 shadow-sm md:px-6">
      <div className="flex flex-col gap-3">
        {/* 1행: 제목 + 일정 추가 버튼 */}
        <div className="flex items-center justify-between">
          <h1 className="text-muted-foreground text-xs font-medium md:text-sm">
            {titleText}
          </h1>
          <button
            type="button"
            onClick={onClickAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            disabled={addDisabled}
          >
            {addDisabled ? "추가 중..." : "+ 일정 추가"}
          </button>
        </div>

        {/* 2행: <  [ 2025년 11월 ]  > */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="border-input bg-background hover:bg-accent/60 inline-flex items-center rounded-md border px-2 py-1 text-[11px]"
          >
            ◀
          </button>

          <button
            type="button"
            onClick={handleOpenMonthPicker}
            className="px-3 py-1"
          >
            <span className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
              {monthLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={onNextMonth}
            className="border-input bg-background hover:bg-accent/60 inline-flex items-center rounded-md border px-2 py-1 text-[11px]"
          >
            ▶
          </button>
        </div>

        {/* 3 + 4행 합치기: 뷰 필터 + 그룹 선택 + 이번 달 요약 */}
        <div className="mt-1 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          {/* 왼쪽: 뷰 필터 + 그룹 선택 */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {/* 뷰 필터 토글 */}
            <div className="bg-muted inline-flex rounded-full p-1 text-xs md:text-sm">
              {[
                { key: "all", label: "전체" },
                { key: "personal", label: "내 일정" },
                { key: "group", label: "그룹별" },
              ].map(({ key, label }) => {
                const active = viewFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onChangeViewFilter(key as ViewFilter)}
                    className={[
                      "rounded-full px-3 py-1 transition",
                      active
                        ? "border-border bg-background text-primary border shadow-sm"
                        : "text-muted-foreground hover:bg-accent/60",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* 그룹 선택 드롭다운 (그룹별일 때만) */}
            {viewFilter === "group" && (
              <select
                className="border-input bg-background text-foreground rounded-md border px-2 py-1 text-xs shadow-sm md:text-sm"
                value={selectedGroupId ?? ""}
                onChange={(e) =>
                  onChangeGroupId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">그룹 선택</option>
                {myGroups?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 오른쪽: 이번 달 일정 요약 */}
          <p className="text-muted-foreground text-right text-[11px] md:text-xs">
            이번 달 등록된 일정 {monthEventCount}개
            {multiDayEventCount > 0 && (
              <span className="ml-1">
                · 이틀 이상 일정 {multiDayEventCount}개
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 📅 년월 이동 모달 */}
      <Dialog open={isMonthPickerOpen} onOpenChange={setIsMonthPickerOpen}>
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
                onClick={() => setIsMonthPickerOpen(false)}
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
    </header>
  );
}
