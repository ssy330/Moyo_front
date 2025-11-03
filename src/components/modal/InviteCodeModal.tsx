import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { closeModal } from "@/features/modalSlice";

export default function InviteCodeModal() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.modal.currentModal === "invite",
  );

  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    if (open) {
      const random = Math.random().toString(36).slice(2, 10);
      setInviteCode(`https://moyo.gg/invite/${random}`);
    }
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      alert("초대 링크가 복사되었습니다! 🌿");
    } catch {
      alert("복사에 실패했어요 😢 다시 시도해주세요.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            초대코드 공유
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-500">
            아래 초대코드를 복사해서 친구에게 전달하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <span className="truncate text-sm text-emerald-800">
            {inviteCode || "생성 중..."}
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={handleCopy}
            className="bg-pink-400 hover:bg-pink-500"
          >
            <Copy size={16} className="mr-1" /> 복사
          </Button>
        </div>

        <p className="mt-3 text-center text-xs text-neutral-500">
          초대 링크는{" "}
          <span className="font-medium text-emerald-600">7일 후 만료</span>돼요.
        </p>
      </DialogContent>
    </Dialog>
  );
}
