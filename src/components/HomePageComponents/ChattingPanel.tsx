// src/components/ChattingPanel.tsx
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useMyChatRooms, type Room } from "@/hook/use-my-chat-room";

interface ChattingPanelProps {
  onSelectChat: (id: string) => void;
  selectedChatId?: string | null;
}

const TABS = ["전체", "개인", "그룹"] as const;
type Tab = (typeof TABS)[number];

const ChattingPanel = ({
  onSelectChat,
  selectedChatId,
}: ChattingPanelProps) => {
  const [searchName, setSearchName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("전체");

  // 🔹 TanStack Query로 방 목록 가져오기
  const { data: rooms = [], isLoading, isError, refetch } = useMyChatRooms();

  // 검색어 필터
  const filteredRooms = useMemo<Room[]>(() => {
    const trimmed = searchName.trim().toLowerCase();
    if (!trimmed) return rooms;

    return rooms.filter((room) => room.name.toLowerCase().includes(trimmed));
  }, [rooms, searchName]);

  const handleSearchClick = () => {
    // 지금은 실시간 필터라 사실 할 일 없음
    // 필요하면 여기서 refetch() 넣어서 서버 검색처럼 바꿀 수도 있음
  };

  return (
    <div className="flex h-[calc(90vh)] flex-col rounded-2xl border border-neutral-200 bg-white shadow-lg">
      {/* 상단 탭 + 검색 영역 */}
      <div className="border-b bg-white">
        {/* 탭 영역 */}
        <div className="flex">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 검색 영역 */}
        <div className="flex items-center gap-2 border-t px-3 py-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="방 이름 검색"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 py-1.5 pr-3 pl-8 text-xs text-neutral-800 transition outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <button
            type="button"
            onClick={handleSearchClick}
            className="flex items-center justify-center rounded-lg border border-emerald-500 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
          >
            검색
          </button>
        </div>
      </div>

      {/* 방 리스트 */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 p-2">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            채팅방을 불러오는 중입니다...
          </div>
        )}

        {/* 에러 상태 */}
        {isError && !isLoading && (
          <div className="flex h-full items-center justify-center text-xs text-red-400">
            채팅방 목록을 불러오지 못했습니다.
            <button
              onClick={() => refetch()}
              className="ml-2 text-[11px] underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 정상 목록 */}
        {!isLoading &&
          !isError &&
          filteredRooms.map((room) => {
            const isActive = selectedChatId === String(room.id);

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectChat(String(room.id))}
                className={`relative mb-1.5 flex w-full cursor-pointer flex-col rounded-xl p-3 text-left transition ${
                  isActive
                    ? "bg-emerald-50 ring-1 ring-emerald-300"
                    : "bg-white hover:bg-neutral-100"
                }`}
              >
                <div className="truncate text-sm font-semibold text-neutral-800">
                  {room.name}
                </div>
                <div className="mt-1 text-[11px] text-neutral-500">
                  #{room.id} ·{" "}
                  {room.created_at
                    ? new Date(room.created_at).toLocaleString()
                    : ""}
                </div>
              </button>
            );
          })}

        {/* 방이 아예 없을 때 */}
        {!isLoading && !isError && rooms.length === 0 && (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            아직 생성된 채팅방이 없습니다.
          </div>
        )}

        {/* 방은 있는데 검색 결과만 없을 때 */}
        {!isLoading &&
          !isError &&
          rooms.length > 0 &&
          filteredRooms.length === 0 && (
            <div className="mt-4 rounded-lg bg-white p-3 text-center text-xs text-neutral-400">
              &quot;{searchName}&quot; 에 대한 채팅방 검색 결과가 없습니다.
            </div>
          )}
      </div>
    </div>
  );
};

export default ChattingPanel;
