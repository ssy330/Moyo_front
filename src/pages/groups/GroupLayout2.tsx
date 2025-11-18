import { useEffect, useState } from "react";
import { MessageCircle, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import GroupsLeftPanel from "@/components/GroupsPageComponents/GroupsLeftPanel";
import GroupChatPanel from "@/components/GroupsPageComponents/GroupChatPanel";
import GroupDetailPage from "@/components/GroupsPageComponents/GroupDetailPage";
import { api } from "@/lib/api";

const RHYMIX_BASE_URL = import.meta.env.VITE_RHYMIX_BASE_URL as string;

export default function GroupLayout() {
  const { id } = useParams();
  const groupId = Number(id);

  const boardUrl = `${RHYMIX_BASE_URL}/board`;

  const [chatOpen, setChatOpen] = useState(false);
  // ✅ 이 그룹에 대응되는 채팅방 id
  const [roomId, setRoomId] = useState<number | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    let cancelled = false;

    (async () => {
      try {
        // POST /api/v1/rooms/by-group/:group_id
        const res = await api.post(`/rooms/by-group/${groupId}`);
        if (cancelled) return;
        setRoomId(res.data.id); // RoomOut.id
      } catch (err) {
        console.error("그룹 채팅방 생성/조회 실패:", err);
      } finally {
        if (!cancelled) setLoadingRoom(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* 🔽 왼쪽 여백 줄이기: max-w / mx-auto 제거 + padding 줄이기 */}
      <div className="w-full px-2 py-6">
        {/* 👇 2열 레이아웃: 왼쪽 260px, 오른쪽 나머지 (gap도 살짝 줄임) */}
        <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start gap-6">
          {/* 왼쪽 그룹 패널 */}
          <aside>
            <GroupsLeftPanel />
          </aside>

          {/* 오른쪽: Rhymix 게시판만 크게 */}
          <main className="space-y-6">
            <section className="rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-800">
                  그룹 게시판
                </h2>

                {/* 🔗 Rhymix 새 창 열기 */}
                <a
                  href={boardUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Rhymix에서 열기
                  <ExternalLink className="h-3 w-3" />
                </a>
              </header>

              {/* Rhymix 게시판 영역: 오른쪽 칸 꽉 채움 */}
              <GroupDetailPage groupId={String(id)} />
            </section>
          </main>
        </div>
      </div>

      {/* ✅ 채팅 오버레이 */}
      {chatOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setChatOpen(false)}
          />
          <div className="fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-md rounded-t-2xl bg-white shadow-2xl md:right-6 md:bottom-6 md:left-auto md:w-[380px] md:rounded-2xl">
            <GroupChatPanel
              groupId={Number(id)}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </>
      )}

      {/* ✅ 채팅 오버레이 (인스타 DM 느낌) */}
      {chatOpen && roomId && (
        <>
          {/* 배경 딤 처리 */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setChatOpen(false)}
          />

          {/* 데스크탑: 오른쪽 아래 카드 / 모바일: 아래에서 올라오는 패널 느낌 */}
          <div className="fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-md rounded-t-2xl bg-white shadow-2xl md:right-6 md:bottom-6 md:left-auto md:w-[380px] md:rounded-2xl">
            <GroupChatPanel
              groupId={groupId}
              roomId={roomId}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </>
      )}

      {/* 채팅 열기 버튼
          - 방 로딩 중이거나 roomId가 아직 없으면 비활성화 처리 */}
      {!chatOpen && (
        <button
          aria-label="채팅 열기"
          disabled={loadingRoom || !roomId}
          onClick={() => setChatOpen((v) => !v)}
          className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
