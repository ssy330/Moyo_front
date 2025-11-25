import { Outlet, useNavigate } from "react-router-dom";
import { User, Bell, CalendarDays, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

const AppLayout = () => {
  const navigate = useNavigate();

  const { session: user } = useSelector((state: RootState) => state.session);

  const avatar = user?.profile_image_url ?? null;

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

          <button
            onClick={() => navigate("/notifications")}
            className="rounded-xl bg-yellow-200 p-2 transition hover:bg-yellow-300"
            title="알림"
          >
            <Bell size={20} className="text-yellow-700" />
          </button>

          <button
            onClick={() => navigate("/calendar")}
            className="rounded-xl bg-green-200 p-2 transition hover:bg-green-300"
            title="캘린더"
          >
            <CalendarDays size={20} className="text-green-700" />
          </button>

          {/* 설정 아이콘 바로 아래 배치 */}
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
    </div>
  );
};

export default AppLayout;
