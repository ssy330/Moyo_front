import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Video, Smile, ListChecks } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { closeModal } from "@/features/modalSlice";

export default function WriteModal() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.modal.currentModal === "write",
  );

  const [text, setText] = useState("");

  return (
    <Dialog open={open} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            글쓰기
          </DialogTitle>
        </DialogHeader>

        {/* 입력 폼 */}
        <div className="mt-2 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="그룹 내 인원들과 나의 일상을 공유해보세요!"
            className="h-50 w-full resize-none rounded-lg border border-neutral-300 px-3 py-3 text-[15px] leading-relaxed focus:ring-1 focus:ring-neutral-400 focus:outline-none"
          />
        </div>

        {/* 아이콘 / 옵션 영역 */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-4 text-neutral-500">
            {[Camera, Video, Smile, ListChecks].map((Icon, idx) => (
              <button
                key={idx}
                className="transition-transform hover:scale-110 hover:text-neutral-800"
              >
                <Icon size={21} strokeWidth={1.8} />
              </button>
            ))}
          </div>
          <Button
            disabled={!text.trim()}
            className="rounded-lg bg-neutral-800 px-5 py-2 font-medium text-white transition hover:bg-neutral-700"
          >
            게시
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
