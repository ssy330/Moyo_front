// src/components/ChattingPanel.tsx
import { useEffect, useState, useMemo } from "react";
import { API_URL } from "@/lib/api-link";
import { Search } from "lucide-react";

interface Room {
  id: number;
  name: string;
  created_at: string;
  group_id?: number | null;
}

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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchName, setSearchName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("전체"); // UI용 탭 상태

  // 여기서 "내 그룹 채팅방"만 가져오도록 변경
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`${API_URL}/rooms/my-group`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`방 목록 불러오기 실패: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Room[]) => {
        setRooms(data);
      })
      .catch((e) => console.error("방 목록 불러오기 실패", e));
  }, []);

  // 검색어로 필터링 (대소문자 무시)
  const filteredRooms = useMemo(() => {
    const trimmed = searchName.trim().toLowerCase();
    if (!trimmed) return rooms;

    return rooms.filter((room) => room.name.toLowerCase().includes(trimmed));
  }, [rooms, searchName]);

  // (선택) 탭 필터링을 붙이고 싶으면 Room에 type 같은 필드 추가 후 여기에서 한 번 더 필터링

  // ✅ 검색 버튼 눌렀을 때 포커스만 유지 (실제 필터는 실시간)
  const handleSearchClick = () => {
    // 필요한 경우 여기서도 서버 요청 or 추가 로직 가능
    // 지금은 단순히 입력 값으로 필터만 하므로 따로 할 건 없음
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
        {filteredRooms.map((room) => {
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

        {/* 리스트가 아예 없을 때 */}
        {rooms.length === 0 && (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            아직 생성된 채팅방이 없습니다. 상단에서 새 방을 만들어 보세요.
          </div>
        )}

        {/* 방은 있는데 검색 결과만 없을 때 */}
        {rooms.length > 0 && filteredRooms.length === 0 && (
          <div className="mt-4 rounded-lg bg-white p-3 text-center text-xs text-neutral-400">
            &quot;{searchName}&quot; 에 대한 채팅방 검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChattingPanel;
