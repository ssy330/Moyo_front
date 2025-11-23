
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "@/lib/calendar-api";
import type { CalendarEvent, CreateEventPayload, UpdateCalendarEventPayload } from "@/lib/calendar-api";

// ✅ 항상 같은 모양으로 쓰기 위한 헬퍼
const calendarEventsKey = (from: string, to: string) =>
    ["calendarEvents", from, to] as const;

export const useCalendarEvents = (from: string, to: string) => {
  return useQuery<CalendarEvent[]>({
    queryKey: calendarEventsKey(from, to),
    queryFn: () => getCalendarEvents(from, to),
  });
};

export const useCreateCalendarEvent = (from: string, to: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => createCalendarEvent(payload),
    onSuccess: () => {
      // 생성 성공하면 목록 다시 가져오기
      queryClient.invalidateQueries({
        queryKey: calendarEventsKey(from, to),
      });
    },
  });
};

// 일정 수정 훅
export function useUpdateCalendarEvent(from: string, to: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; payload: UpdateCalendarEventPayload }) =>
      updateCalendarEvent(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: calendarEventsKey(from, to),
      });
    },
  });
}

// 일정 삭제 훅
export function useDeleteCalendarEvent(from: string, to: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCalendarEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: calendarEventsKey(from, to),
      });
    },
  });
}