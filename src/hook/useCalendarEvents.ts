
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "@/lib/calendar-api";
import type { CalendarEvent, CreateEventPayload, UpdateCalendarEventPayload } from "@/lib/calendar-api";

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

// 일정 수정 훅
export function useUpdateCalendarEvent(from: string, to: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; payload: UpdateCalendarEventPayload }) =>
      updateCalendarEvent(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["calendarEvents", { from, to }],
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
        queryKey: ["calendarEvents", { from, to }],
      });
    },
  });
}