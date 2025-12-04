// src/AppLayout.tsx
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import type { RootState } from "./store/store";
import { useState } from "react";
import { Bell, CalendarDays, Settings, User } from "lucide-react";
import BellModal from "./components/modal/BellModal";
import { useIncomingFriendRequests } from "@/hooks/use-send-friend-request";
import { APP_LAYOUT_THEMES } from "./lib/app-layout-theme";

const AppLayout = () => {
  const navigate = useNavigate();
  const { session: user } = useSelector((state: RootState) => state.session);
  const themeId = useSelector((state: RootState) => state.theme.current);
  const palette = APP_LAYOUT_THEMES[themeId] ?? APP_LAYOUT_THEMES.green;

  const avatar = user?.profile_image_url ?? null;

  // 🔹 알림 모달 열림 상태
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // 🔹 받은 친구 요청 (알림 개수 / 목록에 사용)
  const { data: incoming = [], isLoading: notifLoading } =
    useIncomingFriendRequests();

  const unreadCount = incoming.length; // 나중에 읽음 처리 생기면 여기서 필터링

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ 데스크탑 사이드바 (md 이상에서만 보이게) */}
      <aside
        className={`fixed top-0 left-0 z-40 hidden h-screen w-16 flex-col items-center justify-between border-r py-6 md:flex ${palette.sidebar}`}
      >
        {/* 상단 로고 */}
        <div
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition ${palette.logoButton}`}
          onClick={() => navigate("/")}
        >
          <span className={`text-sm font-bold ${palette.logoText}`}>moyo</span>
        </div>

        {/* 하단 아이콘 묶음 */}
        <div className="flex flex-col items-center gap-6">
          {/* 프로필 버튼 */}
          <button
            onClick={() => navigate("/profile/1")}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${palette.profileButton}`}
            title="내 프로필"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="내 프로필"
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <User size={20} className={palette.profileIcon} />
            )}
          </button>

          {/* 🔔 알림 버튼 */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className={`relative rounded-xl p-2 transition ${palette.notifButton}`}
            title="알림"
          >
            <Bell size={20} className={palette.notifIcon} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* 캘린더 버튼 */}
          <button
            onClick={() => navigate("/calendar")}
            className={`rounded-xl p-2 transition ${palette.calendarButton}`}
            title="캘린더"
          >
            <CalendarDays size={20} className={palette.calendarIcon} />
          </button>

          {/* 설정 아이콘 */}
          <button
            onClick={() => navigate("/settings")}
            className={`mt-2 rounded-xl p-2 transition ${palette.settingsButton}`}
            title="설정"
          >
            <Settings size={20} className={palette.settingsIcon} />
          </button>
        </div>
      </aside>

      {/* ✅ 모바일 상단 바 (md 미만에서만 보이게) */}
      <header
        className={`fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b px-4 md:hidden ${palette.sidebar}`}
      >
        {/* 왼쪽: moyo 로고 */}
        <div
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition ${palette.logoButton}`}
          onClick={() => navigate("/")}
        >
          <span className={`text-sm font-bold ${palette.logoText}`}>moyo</span>
        </div>

        {/* 오른쪽: 캘린더 | 알림 | 프로필 */}
        <div className="flex items-center gap-3">
          {/* 캘린더 버튼 */}
          <button
            onClick={() => navigate("/calendar")}
            className={`rounded-xl p-2 transition ${palette.calendarButton}`}
            title="캘린더"
          >
            <CalendarDays size={20} className={palette.calendarIcon} />
          </button>

          {/* 🔔 알림 버튼 */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className={`relative rounded-xl p-2 transition ${palette.notifButton}`}
            title="알림"
          >
            <Bell size={20} className={palette.notifIcon} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* 프로필 버튼 */}
          <button
            onClick={() => navigate("/profile/1")}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition ${palette.profileButton}`}
            title="내 프로필"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="내 프로필"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User size={18} className={palette.profileIcon} />
            )}
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠
          - 모바일: 상단 바 높이만큼 padding-top
          - 데스크탑: 사이드바 너비만큼 margin-left
      */}
      <main className="min-h-screen pt-14 md:ml-16 md:pt-0">
        <Outlet />
      </main>

      {/* 🔔 알림 모달 */}
      <BellModal
        open={isNotifOpen}
        onOpenChange={setIsNotifOpen}
        incoming={incoming}
        notifLoading={notifLoading}
      />
    </div>
  );
};

export default AppLayout;
