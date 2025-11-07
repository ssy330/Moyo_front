interface ChattingPanelProps {
  onSelectChat: (chatId: string) => void;
}

const ChattingPanel = ({ onSelectChat }: ChattingPanelProps) => {
  const chats = [
    { id: "1", name: "MOTIV", last: "내일 회의 있습니다!", unread: 3 },
    { id: "2", name: "AUNAE", last: "좋아요~", unread: 0 },
    { id: "3", name: "KIS", last: "파일 업로드 완료!", unread: 1 },
  ];

  return (
    <div className="flex h-[calc(90vh)] flex-col rounded-2xl border border-neutral-200 bg-white shadow-lg">
      <div className="flex shrink-0 border-b bg-white">
        {["전체", "개인", "그룹"].map((tab) => (
          <button
            key={tab}
            className="flex-1 py-2 text-sm font-medium hover:bg-neutral-100"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 p-2">
        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectChat(c.id)}
            className="relative cursor-pointer rounded-xl p-3 hover:bg-neutral-100"
          >
            <div className="font-semibold text-neutral-800">{c.name}</div>
            <div className="text-xs text-neutral-500">{c.last}</div>
            {c.unread > 0 && (
              <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-[10px] text-white">
                {c.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChattingPanel;
