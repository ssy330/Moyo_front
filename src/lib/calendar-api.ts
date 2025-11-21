// src/lib/calendar-api.ts  ✅ [신규 파일/전체 내용]

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

// 나중에 필요해지면 여기서 업데이트/삭제도 추가하면 됨
// export const updateCalendarEvent = ...
// export const deleteCalendarEvent = ...
