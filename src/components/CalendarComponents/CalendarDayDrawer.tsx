// src/components/CalendarComponents/CalendarDayDrawer.tsx
import { AnimatePresence, motion } from "framer-motion";
import type { CalendarEvent } from "@/lib/calendar-api";

type CalendarDayDrawerProps = {
  open: boolean;
  date: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
  onClickAdd: (date: Date) => void;
  onClickEvent?: (event: CalendarEvent) => void; // 일정 하나 눌렀을 때(수정 모달 등)
};

function formatKoreanDate(date: Date) {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = days[date.getDay()];
  return {
    title: `${m}월 ${d}일 (${w})`,
    caption: `${y}년 ${m}월`,
  };
}

function formatTimeRange(ev: CalendarEvent) {
  // all_day면 그냥 "하루 종일"
  if (ev.all_day) return "하루 종일";

  const s = new Date(ev.start_at);
  const e = new Date(ev.end_at);

  const pad = (n: number) => String(n).padStart(2, "0");
  const sStr = `${pad(s.getHours())}:${pad(s.getMinutes())}`;
  const eStr = `${pad(e.getHours())}:${pad(e.getMinutes())}`;
  if (sStr === eStr) return sStr;
  return `${sStr} ~ ${eStr}`;
}

export default function CalendarDayDrawer({
  open,
  date,
  events,
  onClose,
  onClickAdd,
  onClickEvent,
}: CalendarDayDrawerProps) {
  return (
    <AnimatePresence>
      {open && date && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* 어두운 배경 (클릭하면 닫힘) */}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-black/20"
          />

          {/* 오른쪽에서 슥 나오는 패널 */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.23, ease: "easeOut" }}
            className="border-border bg-card flex h-full w-full max-w-md flex-col border-l shadow-xl"
          >
            {/* 헤더 */}
            <header className="border-border flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-muted-foreground text-xs">
                  {formatKoreanDate(date).caption}
                </p>
                <h2 className="text-foreground text-lg font-semibold">
                  {formatKoreanDate(date).title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground rounded-full p-1 text-sm"
              >
                ✕
              </button>
            </header>

            {/* 요약 */}
            <div className="border-border bg-muted/60 text-muted-foreground border-b px-4 py-2 text-xs">
              {events.length === 0 ? (
                <>등록된 일정이 없습니다.</>
              ) : (
                <>
                  이 날 등록된 일정{" "}
                  <span className="text-foreground font-semibold">
                    {events.length}
                  </span>
                  개
                </>
              )}
            </div>

            {/* 일정 리스트 */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {events.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                  이 날짜에는 아직 일정이 없어요.
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onClickEvent?.(ev)}
                      className="border-border bg-background hover:bg-accent/60 w-full rounded-xl border px-3 py-2 text-left text-sm shadow-sm transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="line-clamp-1 font-semibold">
                          {ev.title}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {formatTimeRange(ev)}
                        </span>
                      </div>

                      {ev.description && (
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-[11px]">
                          {ev.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 하단: 이 날짜에 일정 추가 */}
            <div className="border-border bg-card border-t px-4 py-3">
              <button
                type="button"
                onClick={() => onClickAdd(date)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
              >
                + 이 날짜에 일정 추가
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
