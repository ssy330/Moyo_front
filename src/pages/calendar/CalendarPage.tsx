
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

// 요일 라벨
const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 날짜를 'YYYY-MM-DD' 문자열로 만드는 헬퍼
function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// [추가] 시간 잘라내서 날짜만 비교하는 헬퍼
function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// 6주(42칸)짜리 달력 셀 생성
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

export default function CalendarPage() {
  // [변경] 월 이동을 위해 setCurrentDate 추가
const [currentDate, setCurrentDate] = useState(() => new Date());
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

  // [추가] 월 이동 / 오늘 버튼 핸들러
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // [추가] 현재 월 표시용 라벨 (예: 2025년 11월)
  const monthLabel = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}년 ${month}월`;
  }, [currentDate]);

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

  // ✅ [추가] 이번 달 일정 개수 요약
  const monthEventCount = events?.length ?? 0;
  
  // ✅ 여러 날짜에 걸친 일정만 카운트 (시작일 ≠ 종료일)
  const multiDayEventCount =
    events?.filter((ev) => {
      const start = stripTime(new Date(ev.start_at));
      const end = stripTime(new Date(ev.end_at));

      const diffDays =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      return diffDays >= 1; // 하루 이상 차이 나는 일정만
    }).length ?? 0;

  // 이번 달 기준 달력 셀 생성
  const monthCells = useMemo(
    () => createMonthCells(currentDate),
    [currentDate]
  );

  // 42칸을 7개씩 잘라서 주(week) 배열로 만들기
  const weeks = useMemo(() => {
    const result: { date: Date; currentMonth: boolean }[][] = [];
    for (let i = 0; i < monthCells.length; i += 7) {
      result.push(monthCells.slice(i, i + 7));
    }
    return result;
  }, [monthCells]);

  // [추가] 오늘 날짜 (YYYY-MM-DD) 문자열
  const todayKey = useMemo(() => {
    return toDateKey(new Date());
  }, []);

  // [추가] 날짜별 이벤트 묶기 (start_at 기준)
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    (events ?? []).forEach((event) => {
      const key = toDateKey(new Date(event.start_at));
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  // 주별로 가로 바 정보를 계산
  type EventSegment = {
    event: CalendarEvent;
    weekIndex: number; // 0~5
    startCol: number;  // 1~7
    endCol: number;    // 1~7
  };

  const weekSegments = useMemo(() => {
    if (!events || events.length === 0 || monthCells.length === 0) {
      return [] as EventSegment[][];
    }

    const segmentsPerWeek: EventSegment[][] = Array.from(
      { length: 6 },
      () => []
    );

    const firstCellDate = stripTime(monthCells[0].date);
    const lastCellDate = stripTime(monthCells[monthCells.length - 1].date);

    const diffDays = (a: Date, b: Date) =>
      Math.floor((stripTime(a).getTime() - stripTime(b).getTime()) / (1000 * 60 * 60 * 24));

    for (const ev of events) {
      const rawStart = stripTime(new Date(ev.start_at));
      const rawEnd = stripTime(new Date(ev.end_at));

      // 이 달력 범위 밖이면 스킵
      if (rawEnd < firstCellDate || rawStart > lastCellDate) continue;

      // 달력 범위로 클램프
      const start = rawStart < firstCellDate ? firstCellDate : rawStart;
      const end = rawEnd > lastCellDate ? lastCellDate : rawEnd;

      let startIndex = diffDays(start, firstCellDate); // 0~41
      let endIndex = diffDays(end, firstCellDate);     // 0~41

      if (startIndex < 0) startIndex = 0;
      if (endIndex > 41) endIndex = 41;
      if (endIndex < startIndex) continue;

      const firstWeek = Math.floor(startIndex / 7);
      const lastWeek = Math.floor(endIndex / 7);

      for (let w = firstWeek; w <= lastWeek; w++) {
        const weekStartIndex = w * 7;
        const weekEndIndex = weekStartIndex + 6;

        const segStartIndex = Math.max(startIndex, weekStartIndex);
        const segEndIndex = Math.min(endIndex, weekEndIndex);

        const startCol = (segStartIndex - weekStartIndex) + 1; // 1~7
        const endCol = (segEndIndex - weekStartIndex) + 1;     // 1~7

        // [변경 후] → 진짜로 "날짜가 2일 이상 걸치는" 일정만 바 처리
        const isMultiDay = diffDays(rawEnd, rawStart) >= 1;

        if (!isMultiDay) continue;

        segmentsPerWeek[w].push({
          event: ev,
          weekIndex: w,
          startCol,
          endCol,
        });
      }
    }

    return segmentsPerWeek;
  }, [events, monthCells]);

  // 일정 생성/수정/삭제 mutation
  const createMutation = useCreateCalendarEvent(from, to);
  const updateMutation = useUpdateCalendarEvent(from, to);
  const deleteMutation = useDeleteCalendarEvent(from, to);

  // 새 일정 모달 열기 (폼 초기화)
  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  // ✅ [추가] 특정 날짜를 눌러서 새 일정 모달 열기
  const handleOpenCreateForDate = (date: Date) => {
    resetForm();
    // date -> 'YYYY-MM-DD' 문자열 (이미 있는 헬퍼 toDateKey 재사용)
    const startStr = toDateKey(date);        // 클릭한 날짜
    const next = new Date(date);
    next.setDate(next.getDate() + 1);        // 다음날
    const endStr = toDateKey(next)

    setStartAt(startStr);      // 시작 날짜를 해당 날짜로
    setEndAt(endStr);        // 기본 종료 날짜도 동일하게
    setAllDay(false);          // 기본값: 종일 일정
    setIsCreateOpen(true);    // 모달 열기
  };

  // 실제 새 일정 생성 핸들러
  const handleCreateEvent = () => {
    // [1] 제목 검사
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // [2] 날짜 입력 여부 검사
    if (!startAt || !endAt) {
      alert("시작과 종료 일자를 모두 입력해주세요.");
      return;
    }

    // [3] 날짜 순서 검사 (시작 > 종료 인 경우)
    // ✅ 종일이면 종료일은 항상 시작일과 같다고 간주
    const effectiveEnd = allDay ? startAt : endAt!;

    const startDateOnly = new Date(startAt);
    const endDateOnly = new Date(effectiveEnd);

    if (startDateOnly > endDateOnly) {
      alert("시작/종료 일자를 바르게 입력해주세요.");
      return;
    }

    // 4) 서버로 보낼 문자열 (⚠️ toISOString() 쓰지 않기!)
    const start_at = `${startAt}T00:00:00`;
    const end_at   = `${effectiveEnd}T23:59:59`;

    createMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        start_at,
        end_at,
        all_day: allDay, // 종일 여부 반영
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

    // 서버에서 온 문자열의 앞 10글자만 사용
    const startStr = event.start_at.slice(0, 10); // "YYYY-MM-DD"
    const endStr   = event.end_at.slice(0, 10);   // "YYYY-MM-DD"

    if (event.all_day) {
      // ✅ 종일 일정은 하루짜리로 통일해서 보여줌
      setAllDay(true);
      setStartAt(startStr);
      setEndAt(startStr);
    } else {
      setAllDay(false);
      setStartAt(startStr);
      setEndAt(endStr);
    }

    setIsEditOpen(true);
  };

  // 일정 수정 핸들러
  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    
    if (!title.trim()) {
    alert("제목을 입력해주세요.");
    return;
  }

  if (!startAt || (!allDay && !endAt)) {
    alert("시작과 종료 일자를 모두 입력해주세요.");
    return;
  }

  const effectiveEnd = allDay ? startAt : endAt!;

  const startDateOnly = new Date(startAt);
  const endDateOnly = new Date(effectiveEnd);

  if (startDateOnly > endDateOnly) {
    alert("시작/종료 일자를 바르게 입력해주세요.");
    return;
  }

  const start_at = `${startAt}T00:00:00`;
  const end_at   = `${effectiveEnd}T23:59:59`;

    updateMutation.mutate(
      {
        id: selectedEvent.id,
        payload: {
          title: title.trim(),
          description: description.trim() || undefined,
          start_at,
          end_at,
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
        {/* [변경] 좌측에 제목 + 월 표시 + 이동 버튼 */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">캘린더</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100"
            >
              ◀
            </button>
            <span className="font-medium">{monthLabel}</span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100"
            >
              ▶
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100"
            >
              오늘
            </button>
          </div>
        </div>

        {/* 우측 : 일정 추가 버튼 → 모달 오픈 */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "추가 중..." : "+ 일정 추가"}
        </button>
      </header>

      {/* ✅ [추가] 이번 달 일정 요약 문구 */}
      <p className="text-xs text-gray-500">
        이번 달 등록된 일정 {monthEventCount}개
        {multiDayEventCount > 0 && (
          <span className="ml-1">
            · 이틀 이상 일정 {multiDayEventCount}개
          </span>
        )}
      </p>

      {/* 로딩/에러 상태 */}
      {isLoading && <div>일정 불러오는 중...</div>}
      {isError && <div className="text-red-500">일정 조회 중 오류가 발생했습니다.</div>}

      {/* [변경] 리스트 대신 달력 뷰 */}
      <div className="mt-4 space-y-2">
        {/* [변경] 요일 헤더 – 일/토 색 분리 */}
        <div className="grid grid-cols-7 text-center text-xs font-medium">
          {DAY_LABELS.map((label, idx) => {
            const isSunday = idx === 0;
            const isSaturday = idx === 6;

            const textColor = isSunday
              ? "text-red-500"
              : isSaturday
              ? "text-blue-500"
              : "text-gray-500";

            return (
              <div key={label} className={textColor}>
                {label}
              </div>
            );
          })}
        </div>


                {/* 주(week) 단위로 렌더링 */}
        <div className="space-y-2">
          {weeks.map((weekCells, weekIndex) => (
            <div key={weekIndex} className="space-y-1">
              {/* 1행: 날짜 박스 */}
              <div className="grid grid-cols-7 gap-x-1 gap-y-1 text-xs">
                {weekCells.map(({ date, currentMonth }) => {
                  const key = toDateKey(date);
                  const day = date.getDate();
                  const dayEvents = eventsByDate[key] ?? [];

                  // 요일 계산
                  const dayOfWeek = date.getDay(); // 0: 일 ~ 6: 토
                  const isSunday = dayOfWeek === 0;
                  const isSaturday = dayOfWeek === 6;

                  // [추가] 기본 배경 + 주말 배경
                  const baseBg = currentMonth ? "bg-white" : "bg-gray-50 text-gray-400";
                  const weekendBg =
                    currentMonth && (isSunday || isSaturday) ? "bg-blue-50" : "";

                  // 날짜 숫자 색 (이번 달 주말일 때만)
                  const dayTextColor =
                    currentMonth && isSunday
                      ? "text-red-500"
                      : currentMonth && isSaturday
                      ? "text-blue-500"
                        : "";
                  
                  // 오늘 날짜인지 판별
                  const isToday = key === todayKey;
                  const todayBorder = isToday ? "border-2 border-blue-500" : "";

                  // ✅ [추가] 하루 이하 일정만 추려서, '더 보기' 개수 계산
                  const shortEvents = dayEvents.filter((ev) => {
                    const s = new Date(ev.start_at);
                    const e = new Date(ev.end_at);
                    const diff =
                      stripTime(e).getTime() - stripTime(s).getTime();
                    // 하루(24시간) 이하인 일정만 "칸 안쪽 점"으로 표시
                    return diff <= 1000 * 60 * 60 * 24;
                  });
                  const MAX_INLINE = 2;
                  const moreCount = shortEvents.length - MAX_INLINE;

                  return (
                    <button
                      key={key}
                      type="button"
                      className={`
                        h-20 rounded-md border p-1 text-left align-top
                        ${currentMonth ? "bg-white" : "bg-gray-50 text-gray-400"} 
                        hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-sm 
                        ${baseBg} ${weekendBg} ${todayBorder}
                        `}
                      onClick={() => handleOpenCreateForDate(date)}   // ✅ 추가
                    >
                      <div className={`text-[11px] font-semibold ${dayTextColor}`}>
                        {day}
                      </div>

                      {/* 🔹 하루짜리 일정은 날짜 칸 안에 표시 */}
                      <div className="mt-1 space-y-0.5">
                        {shortEvents.slice(0, MAX_INLINE).map((ev) => (
                      <div
                        key={ev.id}
                        className="truncate rounded bg-blue-50 px-1 py-0.5 text-[11px] text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(ev); // 기존 수정 모달 열기
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}

                    {moreCount > 0 && (
                      <button
                        type="button"
                        className="mt-0.5 block text-[10px] text-gray-400 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: 나중에 "해당 날짜 일정 전체 모달"로 확장 가능
                        }}
                      >
                        일정 {moreCount}개 더 보기
                      </button>
                    )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 2행: 여러 날짜를 걸친 일정 바 (날짜 아래 가로 바) */}
              <div className="grid grid-cols-7 gap-x-1 text-[11px]">
                {weekSegments[weekIndex]?.map((seg) => (
                  <button
                    key={`${seg.event.id}-${seg.startCol}-${seg.endCol}`}
                    type="button"
                    className="h-5 truncate rounded-full bg-blue-100 px-2 text-left text-blue-800"
                    style={{
                      gridColumnStart: seg.startCol,
                      gridColumnEnd: seg.endCol + 1, // grid는 end가 exclusive
                    }}
                    onClick={() => handleOpenEdit(seg.event)}
                  >
                    {seg.event.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
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

            <div className={`grid grid-cols-1 gap-2 ${allDay ? "" : "md:grid-cols-2"}`}>
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
