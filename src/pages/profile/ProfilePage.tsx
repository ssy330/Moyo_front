import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearSession, setSession } from "@/features/sessionSlice";
import { useAppDispatch } from "@/hook/queries/use-app-dispatch";
import { LogOut, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import type { RootState } from "@/store/store";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { openAlert } from "@/features/alertSlice";
import { mapBackendUserToSessionUser } from "@/features/mapBackendUserToSessionUser";

import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImage } from "@/lib/getCroppedImage";

export default function ProfilePage() {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const { session: user } = useSelector((state: RootState) => state.session);

  const [changeNickname, setChangeNickname] = useState("");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [rawAvatar, setRawAvatar] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const onAvatarCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // 닉네임 변경에 따른 로직
  useEffect(() => {
    if (user?.nickname) {
      setChangeNickname(user.nickname);
    }
  }, [user?.nickname]);

  const name = user?.name ?? "이름 없음";
  const email = user?.email ?? "이메일 없음";
  const nickname = user?.nickname ?? "";
  const avatar = user?.profile_image_url ?? null;

  // 닉네임 수정 클릭
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

  // 닉네임 수정 로직
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

  // 프로필 수정
  const handleProfileEdit = () => {
    // 이전 상태 초기화
    setRawAvatar(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
            <h4 className="mb-3 text-sm font-semibold text-neutral-900">
              프로필 이미지 변경
            </h4>

            {/* 1단계: 파일 선택 전 */}
            {!rawAvatar && (
              <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 text-sm text-emerald-900 hover:border-emerald-400 hover:bg-emerald-50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (!file.type.startsWith("image/")) {
                      toast.warning("이미지 파일만 업로드할 수 있어요.");
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      setRawAvatar(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <span className="mb-2 text-xl">📷</span>
                <span>새 프로필 이미지를 선택하세요</span>
                <span className="mt-1 text-[11px] text-emerald-900/70">
                  JPG, PNG 이미지 파일을 권장해요.
                </span>
              </label>
            )}

            {/* 2단계: 크롭 화면 */}
            {rawAvatar && (
              <>
                <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black">
                  <Cropper
                    image={rawAvatar}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onAvatarCropComplete}
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-10 text-right text-xs text-neutral-500">
                    {zoom.toFixed(1)}x
                  </span>
                </div>
              </>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setRawAvatar(null);
                }}
              >
                취소
              </Button>

              {rawAvatar && (
                <Button
                  type="button"
                  disabled={uploadingAvatar}
                  onClick={async () => {
                    if (!rawAvatar || !croppedAreaPixels) return;

                    try {
                      setUploadingAvatar(true);

                      // 1) 잘라낸 Blob 만들기
                      const blob = await getCroppedImage(
                        rawAvatar,
                        croppedAreaPixels,
                      );

                      // 2) File로 변환
                      const file = new File([blob], "avatar.jpg", {
                        type: blob.type,
                      });

                      // 3) FormData로 서버에 전송
                      const formData = new FormData();
                      formData.append("profile_image", file);

                      const res = await api.patch(
                        "/auth/me/profile-image",
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        },
                      );

                      const updated = res.data;

                      // 4) 세션 업데이트 (프로필 이미지 포함)
                      dispatch(
                        setSession({
                          user: mapBackendUserToSessionUser(updated),
                          source: "fastapi",
                        }),
                      );

                      toast.success("프로필 이미지가 변경되었습니다!");
                      setIsAvatarModalOpen(false);
                      setRawAvatar(null);
                    } catch (err) {
                      console.error(err);
                      toast.error("프로필 이미지 변경에 실패했습니다.");
                    } finally {
                      setUploadingAvatar(false);
                    }
                  }}
                  className="min-w-[100px]"
                >
                  {uploadingAvatar ? "저장 중..." : "적용하기"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
