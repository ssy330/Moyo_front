
import { api } from "./api"; // 이미 있는 axios 인스턴스 사용

// --- 타입 정의 ---

export interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start_at: string; // ISO string
  end_at: string;
  all_day: boolean;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  start_at: string;
  end_at: string;
  all_day?: boolean;
}

// 수정용 payload 타입 (부분 업데이트 허용)
export interface UpdateCalendarEventPayload {
  title?: string;
  description?: string;
  start_at?: string;
  end_at?: string;
  all_day?: boolean;
}



// --- API 함수들 ---

// ⚠️ 백엔드에서 쿼리 파라미터가 from_ 인지 from 인지에 따라 아래 부분만 조정!
// FastAPI 파라미터 이름이 from_ 이고 alias 설정 안했다면 { from_: from, to }
// alias="from" 를 썼다면 { from, to } 로 두시면 됩니다.
export const getCalendarEvents = (from: string, to: string) =>
  api
    .get<CalendarEvent[]>("/calendar/events", {
      params: { from, to }, 
    })
    .then((res) => res.data);

export const createCalendarEvent = (payload: CreateEventPayload) =>
  api.post<CalendarEvent>("/calendar/events", payload).then((res) => res.data);

// 일정 수정 API
// api 는 기존에 사용하던 axios 인스턴스 이름에 맞춰서 바꿔주세요
export async function updateCalendarEvent(
  id: number,
  payload: UpdateCalendarEventPayload
) {
  const res = await api.patch<CalendarEvent>(`/calendar/events/${id}`, payload);
  return res.data;
}

// 일정 삭제 API
export async function deleteCalendarEvent(id: number) {
  await api.delete(`/calendar/events/${id}`);
}