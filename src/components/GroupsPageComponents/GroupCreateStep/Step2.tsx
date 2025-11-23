// src/components/GroupsPageComponents/Step2.tsx
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Step2Props = {
  image: File | null;
  setImage: (file: File | null) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Step2({ image, setImage, onPrev, onNext }: Step2Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setImage(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="mt-4">
      <h2 className="mb-3 text-lg font-semibold">
        그룹에서 사용할 이미지를 선택해주세요
      </h2>
      <p className="mb-6 text-sm text-neutral-500">
        이미지는 언제든 변경할 수 있지만, 첫인상을 좌우하니 천천히 골라도
        좋아요.
      </p>

      <div
        className={`flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
          isDragging
            ? "border-emerald-400 bg-emerald-50"
            : "border-emerald-200 bg-neutral-50 hover:border-emerald-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("group-image-input")?.click()}
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="미리보기"
            className="h-full w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="text-center text-neutral-500">
            <p className="mb-2 text-sm font-medium">
              이미지를 드래그 앤 드롭 하거나 클릭해서 선택하세요
            </p>
            <p className="text-xs text-neutral-400">
              권장 비율 1:1, 5MB 이하의 PNG/JPG
            </p>
          </div>
        )}

        <input
          id="group-image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          className="w-[48%] border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          onClick={onPrev}
        >
          이전
        </Button>
        <Button
          className="w-[48%] bg-emerald-500 font-semibold text-white hover:bg-emerald-400"
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
