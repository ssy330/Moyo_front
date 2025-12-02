import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useGroupJoinByInvite } from "@/hooks/mutation/invite/use-group-join-by-invite";

type GroupJoinModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function GroupJoinModal({ open, onClose }: GroupJoinModalProps) {
  const [inviteCode, setInviteCode] = useState("");

  const handleClose = () => {
    setInviteCode("");
    onClose();
  };

  // 그룹 초대코드로 참여 리팩토링
  const { mutate: joinMutation, isPending: isJoinPending } =
    useGroupJoinByInvite(() => {
      setInviteCode("");
      onClose();
    });

  const handleJoin = () => {
    const code = inviteCode.trim();
    if (!code) return toast.warning("초대 코드를 입력해주세요.");

    joinMutation(code);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="border-border bg-card max-w-md rounded-2xl border p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-primary text-center text-2xl font-bold">
            그룹 참가하기
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center text-sm">
            초대 코드를 입력하여 기존 그룹에 참가하세요.
          </DialogDescription>
        </DialogHeader>

        {/* 안내 문구 */}
        <div className="mb-6 text-center text-sm text-gray-500">
          초대 코드는 이렇게 생겼습니다:
          <br />
          <span className="text-blue-600">영문+숫자 조합 6자리</span>
        </div>

        {/* 입력창 */}
        <div className="mb-6">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="여기에 초대 코드를 붙여 넣으세요"
            className="border-input bg-background text-foreground focus:ring-primary w-full rounded-md border p-3 text-sm focus:ring-2 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">초대 코드를 입력하세요</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-gray-600"
            disabled={isJoinPending}
          >
            취소
          </Button>

          <Button onClick={handleJoin} disabled={isJoinPending}>
            {isJoinPending ? "참가 중..." : "참가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
