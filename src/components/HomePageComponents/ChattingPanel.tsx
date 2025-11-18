// src/components/ChattingPanel.tsx
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE;

interface Room {
  id: number;
  name: string;
  created_at: string;
}

interface ChattingPanelProps {
  onSelectChat: (id: string) => void;
  selectedChatId?: string | null;
}

const ChattingPanel = ({
  onSelectChat,
  selectedChatId,
}: ChattingPanelProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");

  console.log("채팅 패널의 Id : ", selectedChatId);

  // 방 목록 불러오기
  useEffect(() => {
    fetch(`${API_URL}/rooms/`)
      .then((res) => res.json())
      .then((data: Room[]) => {
        setRooms(data);
      })
      .catch((e) => console.error("방 목록 불러오기 실패", e));
  }, []);

  // 방 생성
  const createRoom = async () => {
    const trimmed = newRoomName.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`${API_URL}/rooms/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        console.error("방 생성 실패", await res.text());
        return;
      }

      const created: Room = await res.json();
      setRooms((prev) => [...prev, created]);
      setNewRoomName("");
      onSelectChat(String(created.id));
    } catch (err) {
      console.error("방 생성 에러", err);
    }
  };

  console.log();

  return (
    <div className="flex h-[calc(90vh)] flex-col rounded-2xl border border-neutral-200 bg-white shadow-lg">
      {/* 상단 탭 + 방 생성 영역 */}
      <div className="border-b bg-white">
        <div className="flex">
          {["전체", "개인", "그룹"].map((tab) => (
            <button
              key={tab}
              className="flex-1 py-2 text-sm font-medium hover:bg-neutral-100"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2 border-t px-3 py-2">
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="새 방 이름"
            className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
          <button
            onClick={createRoom}
            className="rounded-lg bg-emerald-500 px-3 text-xs font-medium text-white hover:bg-emerald-600"
          >
            만들기
          </button>
        </div>
      </div>

      {/* 방 리스트 */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 p-2">
        {rooms.map((room) => {
          const isActive = selectedChatId === String(room.id);

          return (
            <button
              key={room.id}
              onClick={() => onSelectChat(String(room.id))}
              className={`relative flex w-full cursor-pointer flex-col rounded-xl p-3 text-left ${
                isActive ? "bg-emerald-50" : "hover:bg-neutral-100"
              }`}
            >
              <div className="font-semibold text-neutral-800">{room.name}</div>
              <div className="mt-1 text-xs text-neutral-500">
                #{room.id} ·{" "}
                {room.created_at
                  ? new Date(room.created_at).toLocaleString()
                  : ""}
              </div>
            </button>
          );
        })}

        {rooms.length === 0 && (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            아직 생성된 채팅방이 없습니다. 상단에서 새 방을 만들어 보세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChattingPanel;
