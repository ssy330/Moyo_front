import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { api } from "@/lib/api";
import { useChatSocket, type ChatMessage } from "@/hook/useChatSocket";

interface GroupChatPanelProps {
  groupId: number;
  onClose: () => void;
}

// 🔹 백엔드 메시지 응답 타입
interface ChatMessageDTO {
  id: number;
  room_id: number;
  user_id: number | null;
  content: string;
  created_at: string;
  user_nickname?: string | null;
}

// ===== KST(Asia/Seoul) 기준 날짜/시간 유틸 =====

// KST 기준 연/월/일/시/분 뽑기
function getKoreaYMDHM(date: Date) {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Asia/Seoul", // ✅ 항상 한국 시간 기준
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

function isSameDayKorea(a: Date, b: Date) {
  const aa = getKoreaYMDHM(a);
  const bb = getKoreaYMDHM(b);
  return aa.year === bb.year && aa.month === bb.month && aa.day === bb.day;
}

function isSameMinuteKorea(a: Date, b: Date) {
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

function formatDateLabelKorea(date: Date) {
  // 예: "11월 21일 금요일"
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function formatTimeLabelKorea(date: Date) {
  const { hour, minute } = getKoreaYMDHM(date);
  const period = hour < 12 ? "오전" : "오후";
  const h12 = ((hour + 11) % 12) + 1;
  const mm = minute.toString().padStart(2, "0");
  return `${period} ${h12}시 ${mm}분`;
}

function parseServerDateAsUTC(value: string): Date {
  if (!value) return new Date();

  // "2025-11-21 09:36:13.702631" → "2025-11-21T09:36:13.702631"
  let normalized = value.replace(" ", "T");

  // 이미 Z나 +09:00 같은 타임존이 붙어있으면 그대로 사용
  const hasTZ = /[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized);
  if (!hasTZ) {
    normalized += "Z"; // ✅ 타임존 없으면 "UTC" 로 간주
  }

  return new Date(normalized);
}

export default function GroupChatPanel({
  groupId,
  onClose,
}: GroupChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Redux에서 내 id 꺼내오기
  const currentUserId = useSelector((state: RootState) => state.auth.id);

  // WebSocket으로 들어오는 메시지 핸들링
  const handleIncomingMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        created_at: msg.created_at ?? new Date().toISOString(),
      },
    ]);
  }, []);

  // WebSocket 연결 (groupId 기준)
  const { connected, sendMessage } = useChatSocket({
    groupId,
    onMessage: handleIncomingMessage,
  });

  // 처음 들어왔을 때 기존 메시지 REST로 가져오기
  useEffect(() => {
    if (!groupId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await api.get<ChatMessageDTO[]>(
          `/messages/rooms/${groupId}`,
        );

        if (cancelled) return;

        const raw = res.data;

        const mapped: ChatMessage[] = raw.map((m) => ({
          id: m.id,
          room_id: m.room_id,
          user_id: m.user_id,
          content: m.content,
          created_at: m.created_at,
          nickname: m.user_nickname ?? null,
        }));

        setMessages(mapped);
      } catch (err) {
        console.error("그룹 채팅 메시지 불러오기 실패:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // 메시지 변경 시 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 보내기
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    // created_at은 서버에서 생성
    sendMessage({
      content: text,
    });

    setInput("");
  };

  // Enter 키로 전송
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[420px] flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-semibold">그룹 채팅 · #{groupId}</span>

          <span
            className={`ml-2 h-2 w-2 rounded-full ${
              connected ? "bg-emerald-500" : "bg-neutral-300"
            }`}
          />
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 채팅 내용 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-neutral-700">
        {loading ? (
          <p className="text-neutral-400">메시지를 불러오는 중입니다...</p>
        ) : messages.length === 0 ? (
          <p className="text-neutral-400">
            아직 메시지가 없습니다. 첫 메시지를 보내보세요!
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((m, idx) => {
              const currentDate = parseServerDateAsUTC(m.created_at);
              const prev = idx > 0 ? messages[idx - 1] : null;
              const next = idx < messages.length - 1 ? messages[idx + 1] : null;

              const prevDate = prev
                ? parseServerDateAsUTC(prev.created_at)
                : null;
              const nextDate = next
                ? parseServerDateAsUTC(next.created_at)
                : null;

              // 🔸 날짜 구분선 필요 여부 (첫 메시지이거나, 이전 메시지와 날짜가 다름 - KST 기준)
              const showDateSeparator =
                !prevDate || !isSameDayKorea(currentDate, prevDate);

              const isMine =
                currentUserId != null && m.user_id === currentUserId;

              const nickname = m.nickname ?? "익명";

              // 🔸 시간 표시 여부 (이 메시지가 "같은 분" 묶음의 마지막일 때만 - KST 기준)
              const sameMinuteAndSameSenderWithNext =
                next &&
                nextDate &&
                next.user_id === m.user_id &&
                isSameMinuteKorea(currentDate, nextDate);

              const showTime = !sameMinuteAndSameSenderWithNext;
              const timeLabel = formatTimeLabelKorea(currentDate);
              const dateLabel = formatDateLabelKorea(currentDate);

              return (
                <div key={m.id}>
                  {/* 날짜 구분선 */}
                  {showDateSeparator && (
                    <div className="my-3 flex justify-center">
                      <span className="rounded-full bg-neutral-200 px-3 py-1 text-[11px] text-neutral-600">
                        {dateLabel}
                      </span>
                    </div>
                  )}

                  {/* 메시지 한 줄 */}
                  <div
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex flex-col ${
                        isMine ? "items-end" : "items-start"
                      }`}
                    >
                      {/* 상대방일 때 닉네임 */}
                      {!isMine && (
                        <div className="mb-px flex items-baseline gap-2 text-[11px] text-neutral-400">
                          <span className="font-medium">{nickname}</span>
                        </div>
                      )}

                      {/* 말풍선 + 시간 (내 메시지면 시간 왼쪽, 상대 메시지면 시간 오른쪽) */}
                      <div
                        className={`flex items-end gap-1 ${
                          isMine ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* 말풍선 */}
                        <div
                          className={`wrap-break-words inline-block max-w-[8em] rounded-2xl px-3 py-2 text-[13px] whitespace-pre-wrap ${
                            isMine
                              ? "rounded-br-sm bg-emerald-500 text-white"
                              : "rounded-bl-sm bg-neutral-100 text-neutral-800"
                          }`}
                        >
                          {m.content}
                        </div>

                        {/* 시간 레이블 */}
                        {showTime && (
                          <span className="text-[10px] text-neutral-400">
                            {timeLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* 입력창 */}
      <div className="flex items-center gap-2 border-t px-3 py-2">
        <input
          className="h-9 flex-1 rounded-full border border-neutral-200 px-3 text-sm outline-none focus:border-emerald-400"
          placeholder={
            connected
              ? "메시지 보내기..."
              : "연결 중입니다. 잠시만 기다려주세요..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="flex h-9 w-10 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSend}
          disabled={!connected || !input.trim()}
        >
          <Send className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
