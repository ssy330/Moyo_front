import { useMemo, useState } from "react";
import {
  useCalendarEvents,
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
} from "@/hook/useCalendarEvents";

import type { CalendarEvent } from "@/lib/calendar-api";

import { useMyGroups } from "@/hook/use-my-groups";
import ScheduleCreateModal from "@/components/modal/ScheduleCreateModal";
import ScheduleEditModal from "@/components/modal/ScheduleEditModal";
import { createMonthCells, stripTime, toDateKey } from "@/lib/calendar-util";
import { CalendarHeader } from "@/components/CalendarComponents/CalendarHeader";
import CalendarMonthView from "@/components/CalendarComponents/CalendarMonthView";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import CalendarDayDrawer from "@/components/CalendarComponents/CalendarDayDrawer";


type ViewFilter = "all" | "personal" | "group";

export default function CalendarPage() {
  // 유저 이름
  const { session: user } = useSelector((state: RootState) => state.session);
  const ownerName = user?.name ?? "";

  // 상태관리
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const { data: myGroups } = useMyGroups();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 새 일정 입력 값들
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState(""); // "YYYY-MM-DD"
  const [endAt, setEndAt] = useState("");
  const [allDay, setAllDay] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  // 폼 초기화 함수
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartAt("");
    setEndAt("");
    setAllDay(false);
  };

  // 월 이동 / 오늘 버튼
  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // 현재 월 표시용 라벨
  const monthLabel = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}년 ${month}월`;
  }, [currentDate]);

  // 이번 달 1일 ~ 다음 달 1일 기준 from/to
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

  // 일정 목록 조회 (여기가 "원본")
  const { data: rawEvents, isError } = useCalendarEvents(from, to);

  // 뷰 필터 적용된 최종 events
  const events: CalendarEvent[] = useMemo(() => {
    if (!rawEvents) return [];

    switch (viewFilter) {
      case "personal":
        // group_id 가 없는 것만 = 개인 일정
        return rawEvents.filter((ev) => !ev.id);

      case "group":
        if (!selectedGroupId) {
          // 그룹 필터만 선택, 특정 그룹 X => 모든 그룹 일정
          return rawEvents.filter((ev) => !!ev.id);
        }
        // 특정 group_id
        return rawEvents.filter((ev) => ev.id === selectedGroupId);

      case "all":
      default:
        return rawEvents;
    }
  }, [rawEvents, viewFilter, selectedGroupId]);

  // 이번 달 일정 개수 요약 (필터 적용 후 기준)
  const monthEventCount = events.length;

  const multiDayEventCount =
    events.filter((ev) => {
      const start = stripTime(new Date(ev.start_at));
      const end = stripTime(new Date(ev.end_at));

      const diffDays =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      return diffDays >= 1;
    }).length ?? 0;

  // 달력 셀 생성
  const monthCells = useMemo(
    () => createMonthCells(currentDate),
    [currentDate],
  );

  // 42칸 -> 7칸씩 잘라서 주 배열
  const weeks = useMemo(() => {
    const result: { date: Date; currentMonth: boolean }[][] = [];
    for (let i = 0; i < monthCells.length; i += 7) {
      result.push(monthCells.slice(i, i + 7));
    }
    return result;
  }, [monthCells]);

  // 오늘 날짜 key
  const todayKey = useMemo(() => {
    return toDateKey(new Date());
  }, []);

  // 날짜별 이벤트 묶기 (필터 적용된 events 기준)
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      const key = toDateKey(new Date(event.start_at));
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  // 주별로 가로 바 정보 계산
  type EventSegment = {
    event: CalendarEvent;
    weekIndex: number; // 0~5
    startCol: number; // 1~7
    endCol: number; // 1~7
  };

  const weekSegments = useMemo(() => {
    if (events.length === 0 || monthCells.length === 0) {
      return [] as EventSegment[][];
    }

    const segmentsPerWeek: EventSegment[][] = Array.from(
      { length: 6 },
      () => [],
    );

    const firstCellDate = stripTime(monthCells[0].date);
    const lastCellDate = stripTime(monthCells[monthCells.length - 1].date);

    const diffDays = (a: Date, b: Date) =>
      Math.floor(
        (stripTime(a).getTime() - stripTime(b).getTime()) /
          (1000 * 60 * 60 * 24),
      );

    for (const ev of events) {
      const rawStart = stripTime(new Date(ev.start_at));
      const rawEnd = stripTime(new Date(ev.end_at));

      // 달력 범위 밖이면 스킵
      if (rawEnd < firstCellDate || rawStart > lastCellDate) continue;

      // 달력 범위 안으로 클램프
      const start = rawStart < firstCellDate ? firstCellDate : rawStart;
      const end = rawEnd > lastCellDate ? lastCellDate : rawEnd;

      let startIndex = diffDays(start, firstCellDate); // 0~41
      let endIndex = diffDays(end, firstCellDate); // 0~41

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

        const startCol = segStartIndex - weekStartIndex + 1; // 1~7
        const endCol = segEndIndex - weekStartIndex + 1; // 1~7

        // 진짜로 "2일 이상 걸치는" 일정만 바 처리
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

  const createMutation = useCreateCalendarEvent(from, to);
  const updateMutation = useUpdateCalendarEvent(from, to);
  const deleteMutation = useDeleteCalendarEvent(from, to);

  // 새 일정 모달 열기
  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  // 특정 날짜 클릭 → 새 일정 모달
  const handleOpenCreateForDate = (date: Date) => {
    resetForm();
    const startStr = toDateKey(date);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const endStr = toDateKey(next);

    setStartAt(startStr);
    setEndAt(endStr);
    setAllDay(false);
    setIsCreateOpen(true);
  };

  // 새 일정 생성
  const handleCreateEvent = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!startAt || !endAt) {
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
    const end_at = `${effectiveEnd}T23:59:59`;

    createMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        start_at,
        end_at,
        all_day: allDay,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          resetForm();
        },
      },
    );
  };

  // 일정 카드 클릭 → 수정 모달
  const handleOpenEdit = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDescription(event.description ?? "");

    const startStr = event.start_at.slice(0, 10);
    const endStr = event.end_at.slice(0, 10);

    if (event.all_day) {
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

  // 일정 수정
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
    const end_at = `${effectiveEnd}T23:59:59`;

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
      },
    );
  };

  // 일정 삭제
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

  // 날짜 변경
  const handleChangeBaseDate = (date: Date) => {
    setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  //drawer
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedDateEvents = useMemo<CalendarEvent[]>(() => {
    if (!selectedDate) return [];
    const key = toDateKey(selectedDate);
    return eventsByDate[key] ?? [];
  }, [selectedDate, eventsByDate]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDrawerOpen(true);
  };

  // 일정 클릭 시 : 기존 수정 모달
  const handleEventClick = (event: CalendarEvent) => {
    handleOpenEdit(event);
  };

  return (
    <div className="space-y-4 p-4">
      <CalendarHeader
        viewFilter={viewFilter}
        onChangeViewFilter={setViewFilter}
        myGroups={myGroups}
        selectedGroupId={selectedGroupId}
        onChangeGroupId={setSelectedGroupId}
        monthLabel={monthLabel}
        baseDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onChangeBaseDate={handleChangeBaseDate}
        onClickAdd={handleOpenCreate}
        addDisabled={createMutation.isPending}
        monthEventCount={monthEventCount}
        multiDayEventCount={multiDayEventCount}
        ownerName={ownerName}
      />

      {isError && (
        <div className="text-red-500">일정 조회 중 오류가 발생했습니다.</div>
      )}

      <CalendarMonthView
        weeks={weeks}
        eventsByDate={eventsByDate}
        weekSegments={weekSegments}
        todayKey={todayKey}
        myGroups={myGroups}
        onDayClick={handleDayClick}
        onEventClick={handleEventClick}
      />

      <CalendarDayDrawer
        open={isDrawerOpen}
        date={selectedDate}
        events={selectedDateEvents}
        onClose={() => setIsDrawerOpen(false)}
        onClickAdd={(date) => handleOpenCreateForDate(date)}
        onClickEvent={(ev) => handleOpenEdit(ev)}
      />

      <ScheduleCreateModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title={title}
        description={description}
        startAt={startAt}
        endAt={endAt}
        allDay={allDay}
        setTitle={setTitle}
        setDescription={setDescription}
        setStartAt={setStartAt}
        setEndAt={setEndAt}
        setAllDay={setAllDay}
        onSubmit={handleCreateEvent}
        isSubmitting={createMutation.isPending}
      />

      <ScheduleEditModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title={title}
        description={description}
        startAt={startAt}
        endAt={endAt}
        allDay={allDay}
        setTitle={setTitle}
        setDescription={setDescription}
        setStartAt={setStartAt}
        setEndAt={setEndAt}
        setAllDay={setAllDay}
        onDelete={handleDeleteEvent}
        onSubmit={handleUpdateEvent}
        isDeleting={deleteMutation.isPending}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
