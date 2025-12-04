import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImage } from "@/lib/getCroppedImage";
import { ImageUp } from "lucide-react";

interface Props {
  profilePreview: string | null;
  setProfilePreview: (url: string | null) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  onProfileFileSelected: (file: File | null) => void;
}

export default function RegisterStep2Profile({
  profilePreview,
  setProfilePreview,
  isDragging,
  setIsDragging,
  onProfileFileSelected,
}: Props) {
  // 원본 이미지 (크롭 전)
  const [rawImage, setRawImage] = useState<string | null>(null);

  // 크롭 UI 상태
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setIsCropOpen(true); // 크롭 모달 열기
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!rawImage || !croppedAreaPixels) return;

    // 1. 잘라낸 이미지를 Blob으로 얻기
    const blob = await getCroppedImage(rawImage, croppedAreaPixels);

    // 2. File로 변환 (서버 전송용)
    const file = new File([blob], "profile.jpg", { type: blob.type });

    // 3. 프리뷰용 URL 생성
    const previewUrl = URL.createObjectURL(blob);
    setProfilePreview(previewUrl);
    onProfileFileSelected(file);

    setIsCropOpen(false);
  };

  const handleCropCancel = () => {
    setIsCropOpen(false);
    setRawImage(null);
    // 필요하면 onProfileFileSelected(null) 도 호출 가능
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">
        프로필 이미지
      </h3>
      <p className="text-xs text-neutral-500 sm:text-sm">
        나를 잘 보여주는 이미지를 선택해 주세요.
        <br />
        드래그 앤 드롭 또는 클릭해서 업로드할 수 있어요.
      </p>

      <div className="max-w-xl">
        <label
          className={`flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-sm transition-all ${
            isDragging
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-300 bg-white hover:border-neutral-500 hover:bg-neutral-50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFilesSelected(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />

          {profilePreview ? (
            <div className="flex flex-col items-center space-y-3">
              {/* 최종 프리뷰: 1:1 + 원형 */}
              <div className="h-28 w-28 overflow-hidden rounded-full border border-neutral-300">
                <img
                  src={profilePreview}
                  alt="프로필 미리보기"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center space-y-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-800 shadow-sm">
                  <span className="text-base">
                    <ImageUp className="h-4 w-4" />
                  </span>
                  <span>이미지 다시 선택하기</span>
                </span>
                <span className="text-[11px] text-neutral-500">
                  마음에 안 들면 언제든지 다시 바꿀 수 있어요.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-800">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-neutral-400 bg-neutral-50">
                <ImageUp className="h-8 w-8" />
              </div>
              <span className="text-sm font-medium">프로필 사진 업로드</span>
              <span className="mt-1 text-[11px] text-neutral-500">
                JPG, PNG 등 이미지 파일을 권장해요. (최대 10MB)
              </span>
              <span className="mt-2 text-[11px] text-neutral-400">
                클릭해서 파일 선택 또는 드래그 앤 드롭
              </span>
            </div>
          )}
        </label>
      </div>

      {/* ===== 크롭 모달 ===== */}
      {isCropOpen && rawImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
            <h4 className="mb-3 text-sm font-semibold text-neutral-900">
              프로필 이미지 자르기 (1:1)
            </h4>

            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1} // ★ 1:1 고정
                cropShape="round" // UI에서도 동그랗게 보이게
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
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

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCropCancel}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
