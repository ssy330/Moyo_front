import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useAppDispatch } from "@/hook/queries/use-app-dispatch";
import { setSession } from "@/features/sessionSlice";
import { mapBackendUserToSessionUser } from "@/features/mapBackendUserToSessionUser";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { getCroppedImage } from "@/lib/getCroppedImage";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ProfileImageChangeModalProps =
  | {
      open?: never;
      onClose: () => void;
    }
  | {
      open: boolean;
      onClose: () => void;
    };

export default function ProfileImageChangeModal(
  props: ProfileImageChangeModalProps,
) {
  const dispatch = useAppDispatch();

  const isOpen = "open" in props ? props.open : true;
  const { onClose } = props;

  const [rawAvatar, setRawAvatar] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // ⭐ 드래그 중인지 표시용
  const [isDragging, setIsDragging] = useState(false);

  const handleCropComplete = useCallback((_: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped);
  }, []);

  const resetState = () => {
    setRawAvatar(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setUploadingAvatar(false);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // ⭐ 파일 처리 공통 함수 (클릭 / 드랍 둘 다 여기로)
  const handleFile = (file: File | undefined | null) => {
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
  };

  const handleApply = async () => {
    if (!rawAvatar || !croppedAreaPixels) return;

    try {
      setUploadingAvatar(true);

      const blob = await getCroppedImage(rawAvatar, croppedAreaPixels);
      const file = new File([blob], "avatar.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("profile_image", file);

      const res = await api.patch("/auth/me/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data;

      dispatch(
        setSession({
          user: mapBackendUserToSessionUser(updatedUser),
          source: "fastapi",
        }),
      );

      toast.success("프로필 이미지가 변경되었습니다!");
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("프로필 이미지 변경에 실패했습니다.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-neutral-900">
            프로필 이미지 변경
          </DialogTitle>
          <DialogDescription className="sr-only">
            프로필 이미지를 업로드하고 크롭하여 저장합니다.
          </DialogDescription>
        </DialogHeader>

        {/* 1단계: 파일 선택 전 */}
        {!rawAvatar && (
          <label
            className={[
              "mt-2 flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-emerald-50/40 text-sm text-emerald-900 transition-colors hover:border-emerald-400 hover:bg-emerald-50",
              isDragging
                ? "border-emerald-500 bg-emerald-100"
                : "border-emerald-200",
            ].join(" ")}
            // ⭐ 드래그 앤 드롭 핸들러들
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);

              const file = e.dataTransfer.files?.[0];
              handleFile(file);
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <span className="mb-2 text-xl">📷</span>
            <span>
              이미지를 <span className="font-semibold">클릭해서 선택</span>
              하거나
              <br />
              <span className="font-semibold">여기로 드래그 앤 드롭</span>하세요
            </span>
            <span className="mt-1 text-[11px] text-emerald-900/70">
              JPG, PNG 이미지 파일을 권장해요.
            </span>
          </label>
        )}

        {/* 2단계: 크롭 화면 */}
        {rawAvatar && (
          <>
            <div className="relative mt-2 h-64 w-full overflow-hidden rounded-xl bg-black">
              <Cropper
                image={rawAvatar}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
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
          <Button type="button" variant="ghost" onClick={handleClose}>
            취소
          </Button>

          {rawAvatar && (
            <Button
              type="button"
              disabled={uploadingAvatar}
              onClick={handleApply}
              className="min-w-[100px]"
            >
              {uploadingAvatar ? "저장 중..." : "적용하기"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
