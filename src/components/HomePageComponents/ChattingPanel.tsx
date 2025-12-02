import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useMyChatRooms, type Room } from "@/hooks/use-my-chat-room";
import ChatRoomItem from "./ChatRoomItem";

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

  const { data: rooms = [], isLoading, isError, refetch } = useMyChatRooms();

  const filteredRooms = useMemo<Room[]>(() => {
    const trimmed = searchName.trim().toLowerCase();
    if (!trimmed) return rooms;

    return rooms.filter((room) => room.name.toLowerCase().includes(trimmed));
  }, [rooms, searchName]);

  const handleSearchClick = () => {
    // 지금은 실시간 필터
  };

  return (
    <div className="border-border bg-card flex h-[calc(90vh)] flex-col rounded-2xl border shadow-lg">
      {/* 상단 탭 + 검색 영역 */}
      <div className="border-border bg-card border-b">
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
                    ? "border-primary bg-primary/10 text-primary border-b-2"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 검색 영역 */}
        <div className="border-border flex items-center gap-2 border-t px-3 py-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="방 이름 검색"
              className="border-input bg-muted text-foreground focus:bg-background focus:ring-primary w-full rounded-lg border py-1.5 pr-3 pl-8 text-xs transition outline-none focus:ring-2"
            />
          </div>
          <button
            type="button"
            onClick={handleSearchClick}
            className="border-primary text-primary hover:bg-primary/10 flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-medium"
          >
            검색
          </button>
        </div>
      </div>

      {/* 방 리스트 */}
      <div className="bg-background flex-1 overflow-y-auto p-2">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            채팅방을 불러오는 중입니다...
          </div>
        )}

        {/* 에러 상태 */}
        {isError && !isLoading && (
          <div className="text-destructive flex h-full items-center justify-center text-xs">
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
              <ChatRoomItem
                key={room.id}
                room={room}
                isActive={isActive}
                onClick={() => onSelectChat(String(room.id))}
              />
            );
          })}

        {/* 방이 아예 없을 때 */}
        {!isLoading && !isError && rooms.length === 0 && (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            아직 생성된 채팅방이 없습니다.
          </div>
        )}

        {/* 방은 있는데 검색 결과만 없을 때 */}
        {!isLoading &&
          !isError &&
          rooms.length > 0 &&
          filteredRooms.length === 0 && (
            <div className="bg-card text-muted-foreground mt-4 rounded-lg p-3 text-center text-xs">
              &quot;{searchName}&quot; 에 대한 채팅방 검색 결과가 없습니다.
            </div>
          )}
      </div>
    </div>
  );
};

export default ChattingPanel;
