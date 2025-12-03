import type { Group } from "@/hooks/use-my-groups";
import type { CalendarEvent } from "@/lib/calendar-api";
import { DAY_LABELS, getEventColor, toDateKey } from "@/utils/calendar-util";

type WeekCell = {
  date: Date;
  currentMonth: boolean;
};

type EventSegment = {
  event: CalendarEvent;
  weekIndex: number;
  startCol: number;
  endCol: number;
};

type CalendarMonthViewProps = {
  weeks: WeekCell[][];
  eventsByDate: Record<string, CalendarEvent[]>;
  weekSegments: EventSegment[][];
  todayKey: string;
  myGroups: Group[] | undefined;
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
};

export default function CalendarMonthView({
  weeks,
  eventsByDate,
  weekSegments,
  todayKey,
  myGroups,
  onDayClick,
  onEventClick,
}: CalendarMonthViewProps) {
  return (
    <div className="mt-2 flex justify-center">
      {/* 캘린더 전체를 카드처럼 감싸서 너비 제한 */}
      <div className="border-border bg-card w-full max-w-4xl rounded-2xl border px-3 py-3 shadow-sm md:px-5 md:py-4">
        {/* 요일 헤더 – 일/토 색 분리 */}
        <div className="grid grid-cols-7 text-center text-[11px] font-medium md:text-xs">
          {DAY_LABELS.map((label, idx) => {
            const isSunday = idx === 0;
            const isSaturday = idx === 6;

            const textColor = isSunday
              ? "text-red-500"
              : isSaturday
                ? "text-blue-500"
                : "text-muted-foreground";

            return (
              <div key={label} className={textColor}>
                {label}
              </div>
            );
          })}
        </div>

        {/* 주(week) 단위로 렌더링 */}
        <div className="mt-2 space-y-2">
          {weeks.map((weekCells, weekIndex) => (
            <div key={weekIndex} className="space-y-1.5">
              {/* 1행: 날짜 박스 */}
              <div className="grid grid-cols-7 gap-x-1.5 gap-y-1.5 text-[11px] md:text-xs">
                {weekCells.map(({ date, currentMonth }) => {
                  const key = toDateKey(date);
                  const day = date.getDate();
                  const dayEvents = eventsByDate[key] ?? [];

                  const dayOfWeek = date.getDay(); // 0: 일 ~ 6: 토
                  const isSunday = dayOfWeek === 0;
                  const isSaturday = dayOfWeek === 6;

                  // 기본 배경 + 주말 배경
                  const baseBg = currentMonth
                    ? "bg-background"
                    : "bg-muted text-muted-foreground/80";
                  const weekendBg =
                    currentMonth && (isSunday || isSaturday)
                      ? "bg-accent/60"
                      : "";

                  // 날짜 텍스트 색 (이번 달 주말일 때만 강조)
                  const dayTextColor =
                    currentMonth && isSunday
                      ? "text-red-500"
                      : currentMonth && isSaturday
                        ? "text-blue-500"
                        : "text-foreground";

                  // 오늘
                  const isToday = key === todayKey;
                  const todayBorder = isToday
                    ? "border-2 border-primary"
                    : "border border-border/70";

                  // 시작/종료 날짜가 같은 일정만 "하루짜리"로 간주
                  const shortEvents = dayEvents.filter((ev: CalendarEvent) => {
                    const startDateStr = ev.start_at.slice(0, 10);
                    const endDateStr = ev.end_at.slice(0, 10);
                    return startDateStr === endDateStr;
                  });

                  const MAX_INLINE = 2;
                  const moreCount = shortEvents.length - MAX_INLINE;

                  return (
                    <button
                      key={key}
                      type="button"
                      className={[
                        "group h-20 rounded-xl p-1.5 text-left align-top text-[11px] transition-[background,border,box-shadow,transform]",
                        todayBorder,
                        baseBg,
                        weekendBg,
                        "hover:border-primary/70 hover:bg-accent/60 hover:-translate-y-[1px] hover:shadow-sm",
                      ].join(" ")}
                      onClick={() => onDayClick(date)}
                    >
                      <div
                        className={`mb-0.5 flex items-center justify-between text-[11px] font-semibold ${dayTextColor}`}
                      >
                        <span>{day}</span>
                        {isToday && (
                          <span className="bg-primary/10 text-primary rounded-full px-1.5 py-[1px] text-[9px] font-medium">
                            오늘
                          </span>
                        )}
                      </div>

                      {/* 하루짜리 일정들 */}
                      <div className="mt-0.5 space-y-0.5">
                        {shortEvents.slice(0, MAX_INLINE).map((ev) => (
                          <div
                            key={ev.id}
                            className={`truncate rounded-md px-1 py-0.5 text-[10px] ${getEventColor(
                              ev,
                              myGroups,
                            )}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(ev);
                            }}
                          >
                            {ev.title}
                          </div>
                        ))}

                        {moreCount > 0 && (
                          <button
                            type="button"
                            className="text-muted-foreground mt-0.5 block text-[10px] underline"
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

              {/* 2행: 여러 날짜를 걸친 일정 바 */}
              <div className="grid grid-cols-7 gap-x-1.5 text-[11px]">
                {weekSegments[weekIndex]?.map((seg) => (
                  <button
                    key={`${seg.event.id}-${seg.startCol}-${seg.endCol}`}
                    type="button"
                    className={`row-start-2 h-5 truncate rounded-full px-2 text-left text-[10px] shadow-sm ${getEventColor(
                      seg.event,
                      myGroups,
                    )}`}
                    style={{
                      gridColumnStart: seg.startCol,
                      gridColumnEnd: seg.endCol + 1,
                    }}
                    onClick={() => onEventClick(seg.event)}
                  >
                    {seg.event.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
