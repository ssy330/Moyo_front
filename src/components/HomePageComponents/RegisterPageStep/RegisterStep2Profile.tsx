interface Props {
  profilePreview: string | null;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  onFilesSelected: (files: FileList | null) => void;
}

export default function RegisterStep2Profile({
  profilePreview,
  isDragging,
  setIsDragging,
  onFilesSelected,
}: Props) {
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
              ? "border-emerald-400 bg-emerald-50/70"
              : "border-emerald-100 bg-emerald-50/40 hover:border-emerald-300 hover:bg-emerald-50/80"
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
            onFilesSelected(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFilesSelected(e.target.files)}
          />

          {profilePreview ? (
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <img
                src={profilePreview}
                alt="프로필 미리보기"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/40 p-3 text-center text-xs text-white">
                클릭하거나 이미지를 드롭해서 변경할 수 있어요.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-emerald-800">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-lg">
                📷
              </div>
              <span className="text-sm font-medium">
                이미지를 드롭하거나 클릭해서 업로드
              </span>
              <span className="mt-1 text-[11px] text-emerald-900/70">
                JPG, PNG 등 이미지 파일을 권장해요.
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
