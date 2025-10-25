import { Outlet, useNavigate } from "react-router-dom";
import { User, Bell, CalendarDays, Settings } from "lucide-react";

const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex">
      {/* 사이드바 */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r border-rose-100 bg-[#FFF6F6] flex flex-col items-center justify-between py-6">
        {/* 상단 로고 */}
        <div
          className="flex items-center justify-center w-10 h-10 bg-rose-200 rounded-xl cursor-pointer hover:bg-rose-300 transition"
          onClick={() => navigate("/")}
        >
          <span className="font-bold text-sm text-gray-800">moyo</span>
        </div>

        {/* 하단 아이콘 묶음 */}
        <div className="flex flex-col items-center gap-6">
          {/* 아이콘 목록들 */}
          <button
            onClick={() => navigate("/profile/1")}
            className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 transition"
            title="내 프로필"
          >
            <User size={20} className="text-sky-700" />
          </button>

          <button
            onClick={() => navigate("/notifications/1")}
            className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 transition"
            title="알림"
          >
            <Bell size={20} className="text-yellow-600" />
          </button>

          <button
            onClick={() => navigate("/calender")}
            className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 transition"
            title="캘린더"
          >
            <CalendarDays size={20} className="text-rose-600" />
          </button>

          {/* 설정 아이콘 바로 아래 배치 */}
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition mt-2"
            title="설정"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="ml-16 flex-1 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
