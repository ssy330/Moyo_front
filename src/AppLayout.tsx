import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import type { RootState } from "./store/store";
import { useState } from "react";
import { Bell, CalendarDays, Settings, User } from "lucide-react";
import BellModal from "./components/modal/BellModal";
import { useIncomingFriendRequests } from "./hook/use-send-friend-request";

const AppLayout = () => {
  const navigate = useNavigate();
  const { session: user } = useSelector((state: RootState) => state.session);

  const avatar = user?.profile_image_url ?? null;

  // 🔹 알림 모달 열림 상태
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  //🔹 받은 친구 요청 (알림 개수 / 목록에 사용)
  const { data: incoming = [], isLoading: notifLoading } =
    useIncomingFriendRequests();

  const unreadCount = incoming.length; // 나중에 읽음 처리 생기면 여기서 필터링

  return (
    <div className="flex">
      {/* 사이드바 */}
      <aside className="fixed top-0 left-0 z-40 flex h-screen w-16 flex-col items-center justify-between border-r border-green-100 bg-green-50 py-6">
        {/* 상단 로고 */}
        <div
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-green-200 transition hover:bg-green-300"
          onClick={() => navigate("/")}
        >
          <span className="text-sm font-bold text-gray-800">moyo</span>
        </div>

        {/* 하단 아이콘 묶음 */}
        <div className="flex flex-col items-center gap-6">
          {/* 프로필 버튼 */}
          <button
            onClick={() => navigate("/profile/1")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-200 transition hover:bg-sky-300"
            title="내 프로필"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="내 프로필"
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <User size={20} className="text-sky-800" />
            )}
          </button>

          {/* 🔔 알림 버튼 */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative rounded-xl bg-yellow-200 p-2 transition hover:bg-yellow-300"
            title="알림"
          >
            <Bell size={20} className="text-yellow-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* 캘린더 버튼 */}
          <button
            onClick={() => navigate("/calendar")}
            className="rounded-xl bg-green-200 p-2 transition hover:bg-green-300"
            title="캘린더"
          >
            <CalendarDays size={20} className="text-green-700" />
          </button>

          {/* 설정 아이콘 */}
          <button
            onClick={() => navigate("/settings")}
            className="mt-2 rounded-xl bg-neutral-100 p-2 transition hover:bg-neutral-200"
            title="설정"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="ml-16 min-h-screen flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* 🔔 오른쪽 상단 작은 알림 모달 */}
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
