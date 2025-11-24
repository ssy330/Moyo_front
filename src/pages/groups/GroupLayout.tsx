//라이믹스가 아닌 자체 게시물 UI 버전
import { MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";

import GroupsLeftPanel from "@/components/GroupsPageComponents/GroupsLeftPanel";
import GroupChatPanel from "@/components/GroupsPageComponents/GroupChatPanel";
import PostFeed from "@/components/GroupsPageComponents/post-feed";
import GlobalLoader from "@/components/layouts/global-loader";
import { useMyGroups } from "@/hook/use-my-groups";
import { api } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import type { ChatMessage } from "@/hook/useChatSocket";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function GroupLayout() {
  const { id } = useParams();
  const groupId = Number(id);

  // 🔹 내 그룹 목록 + 로딩 상태
  const {
    data: groups,
    isLoading: isGroupsLoading,
    error: groupsError,
  } = useMyGroups();

  const group = groups?.find((g) => g.id === groupId);

  // 🔹 채팅 관련 상태
  const [chatOpen, setChatOpen] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  const currentUserId = useSelector((state: RootState) => state.auth.id);

  console.log(hasUnread);

  // ✅ WebSocket 새 메시지 알림 콜백
  const handleNewMessage = useCallback(
    (msg: ChatMessage) => {
      // 채팅창이 닫혀 있고, 내가 보낸 메시지가 아닐 때만 뱃지 On
      if (!chatOpen && msg.user_id !== currentUserId) {
        setHasUnread(true);
      }
    },
    [chatOpen, currentUserId],
  );

  // ✅ 그룹 채팅방 생성/조회
  useEffect(() => {
    // groupId가 이상하면 스킵
    if (!id || Number.isNaN(groupId) || !groupId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await api.post(`/rooms/by-group/${groupId}`);
        if (cancelled) return;
        setRoomId(res.data.id);
      } catch (err) {
        console.error("그룹 채팅방 생성/조회 실패:", err);
      } finally {
        if (!cancelled) {
          setLoadingRoom(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, groupId]);

  // ─────────────────────────────
  // 1) 그룹 목록 로딩 중일 때: 전체 로딩 화면
  // ─────────────────────────────
  if (isGroupsLoading) {
    return <GlobalLoader textType="data" />;
  }

  // ─────────────────────────────
  // 2) 에러 또는 잘못된 그룹 ID / 내 그룹이 아닐 때
  // ─────────────────────────────
  if (groupsError || !id || Number.isNaN(groupId) || !group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm text-neutral-700 shadow">
          잘못된 그룹 ID 이거나, 접근 권한이 없는 그룹입니다.
        </div>
      </div>
    );
  }

  // ─────────────────────────────
  // 3) 정상 렌더링
  // ─────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          {/* 왼쪽 패널: 그룹 정보 / 메뉴 */}
          <aside>
            <GroupsLeftPanel group={group} />
          </aside>

          {/* 오른쪽 메인 */}
          <main className="w-full max-w-[680px] space-y-6">
            {/* 공지사항 */}
            <section className="rounded-2xl bg-white/70 px-6 py-5 shadow-sm backdrop-blur">
              <h2 className="mb-2 text-lg font-semibold text-neutral-800">
                공지 사항
              </h2>
              {/* TODO: 나중에 groupId 기반 공지 API 연결 */}
              <p className="text-sm text-neutral-600">
                아직 등록된 공지사항이 없습니다.
              </p>
            </section>

            {/* 게시판 */}
            <section className="min-h-[420px] rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-800">게시글</h2>
                {/* TODO: 사진첩 / 캘린더 탭 등 추가 가능 */}
              </div>

              {/* ✅ 그룹별 게시글 피드 */}
              <PostFeed groupId={groupId} />
            </section>
          </main>
        </div>
      </div>

      {/* ✅ 채팅 오버레이 */}
      {roomId && (
        <>
          {/* 딤 처리: 열려 있을 때만 */}
          {chatOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setChatOpen(false)}
            />
          )}

          {/* 패널은 항상 마운트하되, className으로만 감춤/노출 */}
          <div
            className={`fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-md rounded-t-2xl bg-white shadow-2xl transition-all duration-200 md:right-6 md:bottom-6 md:left-auto md:w-[380px] md:rounded-2xl ${chatOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
          >
            <GroupChatPanel
              groupId={groupId}
              onClose={() => setChatOpen(false)}
              onNewMessage={handleNewMessage}
            />
          </div>
        </>
      )}

      {/* 채팅 열기 버튼 (room 준비되기 전에는 비활성화) */}
      {!chatOpen && (
        <button
          aria-label="채팅 열기"
          disabled={loadingRoom || !roomId}
          onClick={() => {
            setChatOpen(true);
            setHasUnread(false);
          }}
          className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-emerald-400 text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MessageCircle className="h-6 w-6" />

          {/*  안 읽은 메시지 뱃지 */}
          {hasUnread && (
            <span className="absolute -top-0.5 -left-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>
      )}
    </div>
  );
}
