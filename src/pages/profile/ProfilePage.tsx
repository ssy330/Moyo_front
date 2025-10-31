import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { clearSession } from "@/features/sessionSlice";
import { useAppDispatch, useAppSelector } from "@/hook/use-app-dispatch";
import supabase from "@/lib/supabase";
import { LogOut, Pencil } from "lucide-react";
import { useState } from "react";

// src/pages/profile/ProfilePage.tsx
export default function ProfilePage() {
  const [nickname, setNickname] = useState("Hoping");

  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session.session);
  const user = session?.user;

  const name = user?.user_metadata?.name ?? "이름 없음";
  const email = user?.email ?? "이메일 없음";
  const avatar = user?.user_metadata?.avatar_url;

  const handleNicknameEdit = () => {
    alert(`닉네임이 '${nickname}'(으)로 수정되었습니다.`);
  };

  const handleProfileEdit = () => {
    alert("프로필 이미지를 변경할 수 있습니다.");
  };

  // ✅ 실제 로그아웃 구현
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
      return;
    }

    // Redux 상태 초기화
    dispatch(clearSession());

    // 페이지 이동
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 py-12">
      {/* 프로필 카드 */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        {/* 프로필 이미지 영역 */}
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
            {/* 연필 아이콘 버튼 */}
            <button
              onClick={handleProfileEdit}
              className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xl font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{email}</div>
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

        {/* 활동 기록 카드 */}
        <div className="mt-8 w-full max-w-md">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">내 활동 기록</h2>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2">
                <span>로그인 기록</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    2025. 10. 29. PC (웹)
                  </span>
                  <Button variant="outline" size="sm">
                    확인
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span>정보수정 이력</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">없음</span>
                  <Button variant="outline" size="sm">
                    확인
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span>콘텐츠 백업</span>
                <Button variant="outline" size="sm">
                  확인
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ✅ 로그아웃 버튼 */}
          <div className="mt-6 flex justify-end">
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
    </div>
  );
}
