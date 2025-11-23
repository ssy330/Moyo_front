
import { useMemo, useState } from "react";
import {
  useCalendarEvents,
  useCreateCalendarEvent,
  useUpdateCalendarEvent,   
  useDeleteCalendarEvent,
} from "@/hook/useCalendarEvents";

import type { CalendarEvent } from "@/lib/calendar-api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

// [추가] 요일 라벨
const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// [추가] 날짜를 'YYYY-MM-DD' 문자열로 만드는 헬퍼
function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// [추가] 6주(42칸)짜리 달력 셀 생성
function createMonthCells(baseDate: Date) {
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

// [추가] ISO 문자열 → 'YYYY-MM-DD' 로 변환
function toDateValue(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

export default function CalendarPage() {
  // 현재 보고 있는 기준 날짜 (월 단위로 보기)
  const [currentDate] = useState(() => new Date());
  // 일정 생성 모달 open 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 새 일정 입력 값들
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");   // datetime-local용 문자열
  const [endAt, setEndAt] = useState("");
  const [allDay, setAllDay] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // 폼 초기화 함수
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartAt("");
    setEndAt("");
    setAllDay(false);
  };

  // 이번 달 1일 ~ 다음 달 1일 기준으로 from/to 계산
  const { from, to } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const start = new Date(year, month, 1);
    const nextMonthStart = new Date(year, month + 1, 1);

    return {
      from: start.toISOString(),
      to: nextMonthStart.toISOString(),
    };
  }, [currentDate]);

  // 일정 목록 조회
  const {
    data: events,
    isLoading,
    isError,
  } = useCalendarEvents(from, to);

  // [추가] 이번 달 기준 달력 셀 생성
  const monthCells = useMemo(
    () => createMonthCells(currentDate),
    [currentDate]
  );

  // [추가] 날짜별로 이벤트 묶기 (start_at 기준)
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};

    (events ?? []).forEach((event) => {
      const date = new Date(event.start_at);
      const key = toDateKey(date);
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });

    return map;
  }, [events]);

  // 일정 생성/수정/삭제 mutation
  const createMutation = useCreateCalendarEvent(from, to);
  const updateMutation = useUpdateCalendarEvent(from, to);
  const deleteMutation = useDeleteCalendarEvent(from, to);

  // [추가] 새 일정 모달 열기 (폼 초기화)
  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  // 실제 새 일정 생성 핸들러
  const handleCreateEvent = () => {
    if (!title.trim() || !startAt || !endAt) {
      // TODO: 토스트나 간단한 alert로 안내해도 좋음
      alert("제목과 시작/종료 시간을 입력해주세요.");
      return;
    }

    // 날짜 문자열에 시간 붙여서 Date 객체 생성
    const startDate = new Date(startAt + "T00:00:00");
    const endDate = new Date(endAt + "T23:59:59");

    createMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        all_day: true,
      },
      {
        onSuccess: () => {
          // 폼 초기화 + 모달 닫기
          setIsCreateOpen(false);
          setTitle("");
          setDescription("");
          setStartAt("");
          setEndAt("");
          setAllDay(false);
        },
      }
    );
  };

  // [추가] 일정 카드 클릭 → 수정 모달 열기
  const handleOpenEdit = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDescription(event.description ?? "");
    setAllDay(event.all_day);
    setStartAt(toDateValue(event.start_at));
    setEndAt(toDateValue(event.end_at));
    setIsEditOpen(true);
  };

  // 일정 수정 핸들러
  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    if (!title.trim() || !startAt || !endAt) {
      alert("제목과 시작/종료 시간을 입력해주세요.");
      return;
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    updateMutation.mutate(
      {
        id: selectedEvent.id,
        payload: {
          title: title.trim(),
          description: description.trim() || undefined,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          all_day: allDay,
        },
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setSelectedEvent(null);
          resetForm();
        },
      }
    );
  };

  // 일정 삭제 핸들러
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    if (!window.confirm("정말 이 일정을 삭제하시겠습니까?")) return;

    deleteMutation.mutate(selectedEvent.id, {
      onSuccess: () => {
        setIsEditOpen(false);
        setSelectedEvent(null);
        resetForm();
      },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">캘린더</h1>

        {/* 일정 추가 버튼 → 모달 오픈 */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "추가 중..." : "+ 일정 추가"}
        </button>
      </header>

      {/* 로딩/에러 상태 */}
      {isLoading && <div>일정 불러오는 중...</div>}
      {isError && <div className="text-red-500">일정 조회 중 오류가 발생했습니다.</div>}

      {/* [변경] 리스트 대신 달력 뷰 */}
      <div className="mt-4 space-y-1">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500">
          {DAY_LABELS.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        {/* 날짜 셀 */}
        <div className="grid grid-cols-7 gap-1 text-xs">
          {monthCells.map(({ date, currentMonth }) => {
            const key = toDateKey(date);
            const day = date.getDate();
            const dayEvents = eventsByDate[key] ?? [];

            return (
              <button
                key={key}
                type="button"
                className={`h-24 rounded-md border p-1 text-left align-top hover:border-blue-400 ${
                  currentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                }`}
                // 수정 모달까지 이미 구현된 상태라면, 날짜 칸에서
                // 첫 번째 이벤트를 클릭해서 수정 모달 열게 할 수도 있습니다.
                // 아래 주석을 풀면 작동해요 (handleOpenEdit가 있을 때만!)
                 onClick={() => {
                   if (dayEvents[0]) handleOpenEdit(dayEvents[0]);
                 }}
              >
                {/* 날짜 숫자 */}
                <div className="text-[11px] font-semibold">{day}</div>

                {/* 해당 날짜의 일정들 (최대 2개만 표시) */}
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="truncate rounded bg-blue-50 px-1 py-0.5 text-[11px] text-blue-700"
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-gray-500">
                      + {dayEvents.length - 2}개 더보기
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 일정 생성 모달 */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">시작</label>
                <input
                  type="date"
                  className="w-full rounded border px-2 py-1 text-sm"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
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
                id="allDay"
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
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
              onClick={() => setIsCreateOpen(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-60"
              onClick={handleCreateEvent}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* [추가] 일정 수정 모달 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>일정 수정</DialogTitle>
          </DialogHeader>

          {/* 입력 필드는 생성 모달과 동일, state 를 같이 쓰고 있으므로 그대로 재사용 */}

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
                  onChange={(e) => setStartAt(e.target.value)}
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
                onChange={(e) => setAllDay(e.target.checked)}
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
              onClick={handleDeleteEvent}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-sm"
                onClick={() => setIsEditOpen(false)}
              >
                닫기
              </button>
              <button
                type="button"
                className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-60"
                onClick={handleUpdateEvent}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "수정 중..." : "수정 저장"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
