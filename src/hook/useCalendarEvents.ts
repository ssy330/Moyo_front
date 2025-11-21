
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCalendarEvents, createCalendarEvent } from "@/lib/calendar-api";
import type { CalendarEvent, CreateEventPayload } from "@/lib/calendar-api";

export const useCalendarEvents = (from: string, to: string) => {
  return useQuery<CalendarEvent[]>({
    queryKey: ["calendarEvents", from, to],
    queryFn: () => getCalendarEvents(from, to),
  });
};

export const useCreateCalendarEvent = (from: string, to: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => createCalendarEvent(payload),
    onSuccess: () => {
      // 새 일정 등록 후, 해당 기간 이벤트 목록 다시 가져오기
      queryClient.invalidateQueries({
        queryKey: ["calendarEvents", from, to],
      });
    },
  });
};
