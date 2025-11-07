import { ArrowLeft } from "lucide-react";

interface ChatRoomPanelProps {
  chatId: string | null;
  onBack: () => void;
}

const ChatRoomPanel = ({ chatId, onBack }: ChatRoomPanelProps) => {
  if (!chatId)
    return (
      <div className="flex h-[calc(90vh)] items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-400 shadow-lg">
        채팅을 선택해주세요 💬
      </div>
    );

  const chatName = chatId === "1" ? "MOTIV" : chatId === "2" ? "AUNAE" : "KIS";

  return (
    <div className="flex h-[calc(90vh)] flex-col rounded-2xl border border-neutral-200 bg-white shadow-lg">
      {/* 헤더 */}
      <div className="flex h-12 items-center justify-between border-b bg-white px-4">
        <button onClick={onBack} className="text-sm text-neutral-500">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="font-semibold text-neutral-800">{chatName}</div>
        <button className="text-sm text-neutral-500 hover:text-neutral-800">
          ⚙️
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-2 overflow-y-auto bg-neutral-50 p-4">
        <div className="max-w-[70%] self-start rounded-xl bg-white p-2 shadow">
          안녕하세요!
        </div>
        <div className="max-w-[70%] self-end rounded-xl bg-emerald-100 p-2 shadow">
          반가워요 :)
        </div>
      </div>

      {/* 입력창 */}
      <div className="border-t bg-white p-3">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="w-full rounded-xl border border-neutral-300 p-2 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default ChatRoomPanel;
