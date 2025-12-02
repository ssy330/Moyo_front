export type HasCreatedAt = { created_at: string | Date };

export interface ChatBubbleTimeMeta {
  currentDate: Date;
  showDateSeparator: boolean;
  dateLabel: string;
  timeLabel: string;
  sameMinuteWithNext: boolean; // 다음 메시지와 "같은 분"인지 여부 (sender는 컴포넌트에서 체크)
}

// 예: "2025-11-21 09:36:13.702631" -> Date(UTC)
export function parseServerDateAsUTC(
  value: string | Date | null | undefined,
): Date {
  if (value instanceof Date) return value;
  if (!value) return new Date();

  // "2025-11-21 09:36:13.702631" → "2025-11-21T09:36:13.702631"
  let normalized = value.replace(" ", "T");

  // 이미 Z나 +09:00 같은 타임존이 붙어있으면 그대로 사용
  const hasTZ = /[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized);
  if (!hasTZ) {
    normalized += "Z"; // 타임존 없으면 "UTC"로 간주
  }

  return new Date(normalized);
}

// 🔹 KST 기준 연/월/일/시/분 뽑기
export function getKoreaYMDHM(date: Date) {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Asia/Seoul",
  });

  const parts = formatter.formatToParts(date);
  const getNumber = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  return {
    year: getNumber("year"),
    month: getNumber("month"),
    day: getNumber("day"),
    hour: getNumber("hour"),
    minute: getNumber("minute"),
  };
}

export function isSameDayKorea(a: Date, b: Date) {
  const aa = getKoreaYMDHM(a);
  const bb = getKoreaYMDHM(b);
  return aa.year === bb.year && aa.month === bb.month && aa.day === bb.day;
}

export function isSameMinuteKorea(a: Date, b: Date) {
  const aa = getKoreaYMDHM(a);
  const bb = getKoreaYMDHM(b);
  return (
    aa.year === bb.year &&
    aa.month === bb.month &&
    aa.day === bb.day &&
    aa.hour === bb.hour &&
    aa.minute === bb.minute
  );
}

// 예: "11월 21일 금요일"
export function formatDateLabelKorea(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Seoul",
  }).format(date);
}

// 예: "오전 3시 05분"
export function formatTimeLabelKorea(date: Date) {
  const { hour, minute } = getKoreaYMDHM(date);
  const period = hour < 12 ? "오전" : "오후";
  const h12 = ((hour + 11) % 12) + 1;
  const mm = minute.toString().padStart(2, "0");
  return `${period} ${h12}시 ${mm}분`;
}

// 🔹 방 리스트에서 쓸 짧은 포맷 (예: "11/21 오후 3:05")
export function formatRoomPreviewTimeKorea(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Seoul",
  }).format(date);
}

export function getChatBubbleTimeMeta<T extends HasCreatedAt>(
  items: T[],
  index: number,
): ChatBubbleTimeMeta {
  const item = items[index];
  const currentDate = parseServerDateAsUTC(item.created_at);

  const prevItem = index > 0 ? items[index - 1] : null;
  const nextItem = index < items.length - 1 ? items[index + 1] : null;

  const prevDate = prevItem ? parseServerDateAsUTC(prevItem.created_at) : null;
  const nextDate = nextItem ? parseServerDateAsUTC(nextItem.created_at) : null;

  // 날짜 구분선 표시 여부
  const showDateSeparator = !prevDate || !isSameDayKorea(currentDate, prevDate);

  // 다음 메시지와 "같은 분"인지 (sender는 아직 모름)
  const sameMinuteWithNext =
    !!nextDate && isSameMinuteKorea(currentDate, nextDate);

  const dateLabel = formatDateLabelKorea(currentDate);
  const timeLabel = formatTimeLabelKorea(currentDate);

  return {
    currentDate,
    showDateSeparator,
    dateLabel,
    timeLabel,
    sameMinuteWithNext,
  };
}
