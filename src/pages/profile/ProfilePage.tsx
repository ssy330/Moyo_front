import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearSession } from "@/features/sessionSlice";
import { useAppDispatch } from "@/hook/queries/use-app-dispatch";
import supabase from "@/lib/supabase";
import { LogOut, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

export default function ProfilePage() {
  const dispatch = useAppDispatch();

  const [nickname, setNickname] = useState("");
  const [name, setName] = useState<string>("이름 없음");
  const [email, setEmail] = useState<string>("이메일 없음");
  const [avatar, setAvatar] = useState<string | null>(null);

  // ✅ 1. Supabase 세션 먼저 확인
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (session) {
          // ✅ Supabase 로그인 상태
          const user = session.user;
          setNickname(user?.user_metadata?.name ?? "이름 없음");
          setName(user?.user_metadata?.name ?? "이름 없음");
          setEmail(user?.email ?? "이메일 없음");
          setAvatar(user?.user_metadata?.avatar_url ?? null);
        } else {
          // ✅ FastAPI 로그인 상태 확인
          const token = localStorage.getItem("access_token");
          if (token) {
            const res = await fetch(`${API_BASE}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const me = await res.json();
              setNickname(me.name);
              setName(me.name);
              setEmail(me.email);
              setAvatar(null); // 백엔드에 아바타 없으면 null
            } else {
              console.warn("FastAPI 사용자 불러오기 실패");
            }
          }
        }
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };

    loadProfile();
  }, []);

  // ✅ 닉네임 수정
  const handleNicknameEdit = () => {
    alert(`닉네임이 '${nickname}'(으)로 수정되었습니다.`);
  };

  // ✅ 프로필 이미지 수정
  const handleProfileEdit = () => {
    alert("프로필 이미지를 변경할 수 있습니다.");
  };

  // ✅ Supabase 로그아웃
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem("access_token"); // FastAPI 토큰도 같이 제거
    localStorage.removeItem("refreash_token");

    if (error) {
      console.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
      return;
    }

    dispatch(clearSession());
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 py-12">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        {/* 프로필 이미지 */}
        <div className="relative flex flex-col items-center space-y-3">
          <div className="relative h-24 w-24">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl text-gray-400">
                👤
              </div>
            )}
            <button
              onClick={handleProfileEdit}
              className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          {/* 이름 + 닉네임 + 이메일 */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-1 text-xl font-semibold">
              <span>{name}</span>
              <span className="text-sm text-gray-500">@{nickname}</span>
            </div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
        </div>

        {/* 닉네임 수정 */}
        <div className="mt-8">
          <label className="mb-2 block text-sm text-gray-700">별명</label>
          <div className="flex items-center space-x-2">
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleNicknameEdit}>
              수정
            </Button>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>로그아웃</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
