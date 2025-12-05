// src/components/GroupsPageComponents/Step2.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUp } from "lucide-react";

type Step2Props = {
  image: File | null;
  setImage: (file: File | null) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Step2({ image, setImage, onPrev, onNext }: Step2Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 📌 File → preview URL 관리
  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      // 필요하면 toast 같은 거 추가 가능
      return;
    }
    setImage(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="mt-4 space-y-6">
      <div>
        <h2 className="mb-2 text-lg font-semibold text-neutral-900">
          그룹 대표 이미지
        </h2>
        <p className="text-sm text-neutral-500">
          모임을 가장 잘 보여줄 수 있는 이미지를 선택해 주세요.
          <br />
          나중에 언제든 변경할 수 있으니, 부담 가지지 않아도 괜찮아요.
        </p>
      </div>

      <div className="max-w-xl">
        <label
          htmlFor="group-image-input"
          className={`flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border bg-white text-sm transition-all ${
            isDragging
              ? "border-neutral-800 bg-neutral-50"
              : "border-dashed border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* 실제 파일 인풋 */}
          <input
            id="group-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />

          {previewUrl ? (
            <div className="flex flex-col items-center space-y-3">
              {/* 동그란 프리뷰 */}
              <div className="h-28 w-28 overflow-hidden rounded-full border border-neutral-300">
                <img
                  src={previewUrl}
                  alt="그룹 이미지 미리보기"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col items-center space-y-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-800 shadow-sm">
                  <ImageUp className="h-4 w-4" />
                  <span>이미지 다시 선택하기</span>
                </span>
                <span className="text-[11px] text-neutral-500">
                  마음에 안 들면 언제든지 다른 이미지로 변경할 수 있어요.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-800">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-neutral-400 bg-neutral-50">
                <ImageUp className="h-8 w-8" />
              </div>
              <span className="text-sm font-medium">그룹 이미지 업로드</span>
              <span className="mt-1 text-[11px] text-neutral-500">
                JPG, PNG 등 이미지를 권장해요. (최대 5MB)
              </span>
              <span className="mt-2 text-[11px] text-neutral-400">
                클릭해서 파일 선택 또는 드래그 앤 드롭
              </span>
            </div>
          )}
        </label>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" className="w-[48%]" onClick={onPrev}>
          이전
        </Button>
        <Button className="w-[48%]" onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
