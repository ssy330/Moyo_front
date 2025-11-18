import { useEffect, useState } from "react";
import GroupsLeftPanel from "@/components/GroupsPageComponents/GroupsLeftPanel";
import { MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import GroupChatPanel from "@/components/GroupsPageComponents/GroupChatPanel";
import PostFeed from "@/components/GroupsPageComponents/post-feed";

export default function GroupLayout() {
  const { id } = useParams();
  const groupId = Number(id);

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
    <div className="min-h-screen text-neutral-900">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          {/* 왼쪽 패널 */}
          <GroupsLeftPanel />

          {/* 오른쪽 메인 */}
          <main className="w-full max-w-[680px] space-y-6">
            {/* 공지사항 */}
            <section className="rounded-2xl bg-white/70 px-6 py-5 shadow-sm backdrop-blur">
              <h2 className="mb-2 text-lg font-semibold text-neutral-800">
                공지 사항
              </h2>
              <p className="text-sm text-neutral-600">
                아직 등록된 공지사항이 없습니다.
              </p>
            </section>

            {/* 게시판 */}
            <section className="min-h-[420px] rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-800">게시글</h2>
                {/* 여기 사진첩/캘린더 아이콘은 그대로 두거나 나중에 상태 연결 */}
              </div>
              <PostFeed />
              {/* <GroupBoardEmbed groupId={groupId} /> */}
              {/* <GroupDetailPage groupId={String(id)} /> */}
            </section>
          </main>
        </div>
      </div>

      {/* ✅ 채팅 오버레이 (인스타 DM 느낌) */}
      {chatOpen && (
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
              onClose={() => setChatOpen(false)}
            />
          </div>
        </>
      )}

      {/* 채팅 열기 */}
      {!chatOpen && (
        <button
          aria-label="채팅 열기"
          onClick={() => setChatOpen((v) => !v)}
          className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
