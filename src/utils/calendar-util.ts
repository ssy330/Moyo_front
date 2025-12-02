import type { Group } from "@/hooks/use-my-groups";
import type { CalendarEvent } from "@/lib/calendar-api";

// 요일 라벨
export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 날짜를 'YYYY-MM-DD' 문자열로 만드는 헬퍼
export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// [추가] 시간 잘라내서 날짜만 비교하는 헬퍼
export function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// 6주(42칸)짜리 달력 셀 생성
export function createMonthCells(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const firstDay = firstOfMonth.getDay(); // 0(일) ~ 6(토)

  // 그 달의 첫째날이 포함된 주의 '일요일'로 이동
  const firstCellDate = new Date(year, month, 1 - firstDay);

  const cells: { date: Date; currentMonth: boolean }[] = [];

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(firstCellDate);
    cellDate.setDate(firstCellDate.getDate() + i);

    cells.push({
      date: cellDate,
      currentMonth: cellDate.getMonth() === month,
    });
  }

  return cells;
}

const PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-800",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
];

export function getEventColor(
  ev: CalendarEvent,
  myGroups: Group[] | undefined,
) {
  // 개인 일정은 항상 인디고 색
  if (!ev.id) {
    return "bg-indigo-100 text-indigo-700";
  }

  const idx = myGroups?.findIndex((g) => g.id === ev.id) ?? -1;
  const safeIdx = idx >= 0 ? idx : 0;
  return PALETTE[safeIdx % PALETTE.length];
}

// datetime-local 값으로 변환하는 헬퍼
/** function toDateTimeLocalValue(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
} **/
