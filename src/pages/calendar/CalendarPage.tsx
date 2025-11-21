
import { useMemo, useState } from "react";
import { useCalendarEvents, useCreateCalendarEvent } from "@/hook/useCalendarEvents";
import type { CalendarEvent } from "@/lib/calendar-api";

export default function CalendarPage() {
  // 현재 보고 있는 기준 날짜 (월 단위로 보기)
  const [currentDate] = useState(() => new Date());

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

  // 일정 생성
  const createMutation = useCreateCalendarEvent(from, to);

  const handleCreateTestEvent = () => {
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

    createMutation.mutate({
      title: "테스트 일정",
      description: "캘린더 MVP 테스트",
      start_at: now.toISOString(),
      end_at: inOneHour.toISOString(),
      all_day: false,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">캘린더</h1>

        {/* MVP용: 테스트 일정 추가 버튼 */}
        <button
          type="button"
          onClick={handleCreateTestEvent}
          className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "추가 중..." : "테스트 일정 추가"}
        </button>
      </header>

      {/* 로딩/에러 상태 */}
      {isLoading && <div>일정 불러오는 중...</div>}
      {isError && <div className="text-red-500">일정 조회 중 오류가 발생했습니다.</div>}

      {/* 일정 리스트 (MVP에서는 간단 리스트만) */}
      <div className="space-y-2">
        {events && events.length === 0 && (
          <div className="text-sm text-gray-500">이번 달 등록된 일정이 없습니다.</div>
        )}

        {events?.map((event: CalendarEvent) => ( // ✅ event 에 타입 붙이기
          <div
            key={event.id}
            className="rounded-md border border-gray-200 p-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{event.title}</span>
              {event.all_day && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                  종일
                </span>
              )}
            </div>

            <div className="mt-1 text-xs text-gray-500">
              <div>시작: {new Date(event.start_at).toLocaleString()}</div>
              <div>종료: {new Date(event.end_at).toLocaleString()}</div>
            </div>

            {event.description && (
              <p className="mt-2 text-sm text-gray-800">{event.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
