import { MessageCircle, Send, X } from "lucide-react";

// 👇 나중에 진짜 채팅 컴포넌트로 교체 예정
export default function GroupChatPanel({
  groupId,
  onClose,
}: {
  groupId: number;
  onClose: () => void;
}) {
  return (
    <div className="flex h-[420px] flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-semibold">그룹 채팅 · #{groupId}</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 채팅 내용 영역 (스크롤) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-neutral-700">
        {/* TODO: 실제 메시지 리스트 들어갈 곳 */}
        <p className="text-neutral-400">
          아직 메시지가 없습니다. 첫 메시지를 보내보세요!
        </p>
      </div>

      {/* 입력창 */}
      <div className="flex items-center gap-2 border-t px-3 py-2">
        <input
          className="h-9 flex-1 rounded-full border border-neutral-200 px-3 text-sm outline-none focus:border-emerald-400"
          placeholder="메시지 보내기..."
        />
        <button className="h-9 w-10 items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600">
          <Send className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
