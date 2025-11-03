import { X } from "lucide-react";
import type { ModalProps } from "@/types/types";

export default function GroupSettingModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[420px] rounded-2xl bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 rounded-full p-1 text-neutral-500 hover:bg-neutral-100"
        >
          <X size={18} />
        </button>

        <h2 className="mb-4 text-xl font-semibold text-neutral-800">
          ⚙️ 그룹 설정
        </h2>

        <div className="space-y-4 text-sm text-neutral-700">
          <div>
            <label className="block font-medium text-neutral-800">
              그룹 이름
            </label>
            <input
              type="text"
              placeholder="예: MOYO 그룹"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-800">
              그룹 소개
            </label>
            <textarea
              placeholder="그룹에 대한 설명을 입력해주세요."
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-emerald-400 focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-neutral-800">
              그룹 이미지
            </label>
            <input
              type="file"
              className="block w-full text-sm text-neutral-600"
            />
          </div>

          <button className="mt-6 w-full rounded-lg bg-emerald-500 py-2 font-semibold text-white transition hover:bg-emerald-600">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
