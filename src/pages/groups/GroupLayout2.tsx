import { useEffect, useState } from "react";
import { MessageCircle, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import GroupsLeftPanel from "@/components/GroupsPageComponents/GroupsLeftPanel";
import GroupChatPanel from "@/components/GroupsPageComponents/GroupChatPanel";
import GroupDetailPage from "@/components/GroupsPageComponents/GroupDetailPage";
import { api } from "@/lib/api";
import { useMyGroups } from "@/hook/use-my-groups";
import GlobalLoader from "@/components/layouts/global-loader";

const RHYMIX_BASE_URL = import.meta.env.VITE_RHYMIX_BASE_URL as string;

export default function GroupLayout() {
  const { id } = useParams();
  const groupId = Number(id);

  // 🔹 내 그룹 목록 + 로딩 상태
  const { data: groups, isLoading: isGroupsLoading, error } = useMyGroups();
  const group = groups?.find((g) => g.id === groupId);

  const boardUrl = `${RHYMIX_BASE_URL}/board`;

  const [chatOpen, setChatOpen] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  // ✅ 그룹 채팅방 생성/조회
  useEffect(() => {
    if (!groupId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await api.post(`/rooms/by-group/${groupId}`);
        if (cancelled) return;
        setRoomId(res.data.id);
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

  // ─────────────────────────────
  // 1) 그룹 목록 로딩 중일 때: 전체 로딩 화면
  // ─────────────────────────────
  if (isGroupsLoading) {
    return <GlobalLoader textType="data" />;
  }

  // ─────────────────────────────
  // 2) 에러 또는 잘못된 그룹 ID
  // ─────────────────────────────
  if (error || !group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm text-neutral-700 shadow">
          잘못된 그룹 ID 입니다.
        </div>
      </div>
    );
  }

  // ─────────────────────────────
  // 3) 정상 렌더링
  // ─────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="w-full px-2 py-6">
        <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start gap-6">
          {/* 왼쪽 그룹 패널 */}
          <aside>
            <GroupsLeftPanel group={group} />
          </aside>

          {/* 오른쪽: Rhymix 게시판 */}
          <main className="space-y-6">
            <section className="rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-800">
                  그룹 게시판
                </h2>

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

              <GroupDetailPage groupId={String(group.id)} />
            </section>
          </main>
        </div>
      </div>

      {/* 채팅 오버레이 (roomId 생성 전에는 버튼 비활성화) */}
      {chatOpen && roomId && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setChatOpen(false)}
          />
          <div className="fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-md rounded-t-2xl bg-white shadow-2xl md:right-6 md:bottom-6 md:left-auto md:w-[380px] md:rounded-2xl">
            <GroupChatPanel
              groupId={groupId}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </>
      )}

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
