// src/hook/useCalendarEvents.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  type CalendarEvent,
  type CreateEventPayload,
  type UpdateEventPayload,
} from "@/lib/calendar-api";

// 항상 같은 모양으로 쓰기 위한 헬퍼
const calendarEventsKey = (from: string, to: string) =>
  ["CalendarEvents", from, to] as const;

// 일정 목록 조회
export const useCalendarEvents = (from: string, to: string) => {
  return useQuery<CalendarEvent[]>({
    queryKey: calendarEventsKey(from, to),
    queryFn: () => getCalendarEvents(from, to),
  });
};

// 일정 생성
export const useCreateCalendarEvent = (from: string, to: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => createCalendarEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: calendarEventsKey(from, to),
      });
    },
  });
};

// 일정 수정
export function useUpdateCalendarEvent(from: string, to: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; payload: UpdateEventPayload }) =>
      updateCalendarEvent(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: calendarEventsKey(from, to),
      });
    },
  });
}

// 일정 삭제
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
