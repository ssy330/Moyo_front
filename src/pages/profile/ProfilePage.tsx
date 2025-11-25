import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearSession, setSession } from "@/features/sessionSlice";
import { useAppDispatch } from "@/hook/queries/use-app-dispatch";
import { LogOut, Pencil, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "@/store/store";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { openAlert } from "@/features/alertSlice";
import { mapBackendUserToSessionUser } from "@/features/mapBackendUserToSessionUser";

import ProfileImageChangeModal from "@/components/modal/ProfileImageChangeModal";

export default function ProfilePage() {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const { session: user } = useSelector((state: RootState) => state.session);

  // 닉네임 입력값
  const [changeNickname, setChangeNickname] = useState("");
  // 아바타 모달 열림 여부
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // 닉네임 초기값 세팅
  useEffect(() => {
    if (user?.nickname) {
      setChangeNickname(user.nickname);
    }
  }, [user?.nickname]);

  const name = user?.name ?? "이름 없음";
  const email = user?.email ?? "이메일 없음";
  const nickname = user?.nickname ?? "";
  const avatar = user?.profile_image_url ?? null;

  // 닉네임 수정 버튼 클릭
  const handleNicknameEditClick = () => {
    const newNickname = changeNickname.trim();
    if (!newNickname) {
      toast.warning("닉네임을 입력해주세요.");
      return;
    }
    dispatch(
      openAlert({
        title: "닉네임 변경",
        description: "정말 이 닉네임으로 변경하시겠습니까?",
        onPositive: () => confirmNicknameEdit(newNickname),
        onNegative: () => {},
      }),
    );
  };

  // 닉네임 실제 PATCH
  const confirmNicknameEdit = async (newNickname: string) => {
    try {
      const res = await api.patch("/auth/me/nickname", {
        nickname: newNickname,
      });

      const updated = res.data;

      dispatch(
        setSession({
          user: mapBackendUserToSessionUser(updated),
          source: "fastapi",
        }),
      );

      toast.success("닉네임이 성공적으로 변경되었습니다!");
    } catch (err) {
      console.error(err);
      toast.error("닉네임 변경에 실패했습니다.");
    }
  };

  // 프로필 이미지 수정 버튼
  const handleProfileEdit = () => {
    setIsAvatarModalOpen(true);
  };

  // 로그아웃 모달
  const handleLogoutClick = () => {
    dispatch(
      openAlert({
        title: "로그아웃",
        description: "정말 로그아웃 하시겠습니까?",
        onPositive: () => logout(),
        onNegative: () => {},
      }),
    );
  };

  // 로그아웃 로직
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreash_token");

    dispatch(clearSession());
    nav("/login", { replace: true });
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
                <User />
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
              {nickname && (
                <span className="text-sm text-gray-500">@{nickname}</span>
              )}
            </div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
        </div>

        {/* 닉네임 수정 */}
        <div className="mt-8">
          <label className="mb-2 block text-sm text-gray-700">별명</label>
          <div className="flex items-center space-x-2">
            <Input
              value={changeNickname}
              onChange={(e) => setChangeNickname(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleNicknameEditClick}>
              수정
            </Button>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleLogoutClick}
            className="flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>로그아웃</span>
          </Button>
        </div>
      </div>

      {/* ================= 프로필 이미지 변경 모달 ================= */}
      {isAvatarModalOpen && (
        <ProfileImageChangeModal onClose={() => setIsAvatarModalOpen(false)} />
      )}
    </div>
  );
}
