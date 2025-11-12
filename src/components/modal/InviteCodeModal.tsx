import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { closeModal } from "@/features/modalSlice";
import { useCreateInvite } from "@/hook/mutation/invite/use-invite-mutation";

export default function InviteCodeModal() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.modal.currentModal?.type === "invite",
  );

  const { mutate: create, isPending } = useCreateInvite();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // ✅ 초대코드 생성 요청
  const handleCreateClick = () => {
    create(
      {
        purpose: "group_join",
        payload: { groupId: 3 },
        maxUses: 5,
        ttlMinutes: 60,
      },
      {
        onSuccess: (data) => {
          // 백엔드에서 받은 코드로 링크 구성
          const link = `${data.code}`;
          setInviteCode(link);
        },
        onError: (err) => {
          console.error("초대코드 생성 실패:", err);
          alert("초대코드 생성 중 오류가 발생했습니다.");
        },
      },
    );
  };

  // ✅ 복사하기
  const handleCopy = async () => {
    if (!inviteCode) return;
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
            초대코드를 생성하고 복사하여 친구에게 공유하세요.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ 초대코드 영역 */}
        {inviteCode ? (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <span className="justify-center truncate text-sm text-emerald-800">
              {inviteCode}
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
        ) : (
          <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
            아직 생성된 초대코드가 없습니다.
          </div>
        )}

        {/* ✅ 생성 버튼 */}
        <Button
          onClick={handleCreateClick}
          disabled={isPending}
          className="mt-4 w-full bg-emerald-500 text-white hover:bg-emerald-600"
        >
          {isPending ? "생성 중..." : "초대코드 생성"}
        </Button>

        <p className="mt-3 text-center text-xs text-neutral-500">
          초대 링크는{" "}
          <span className="font-medium text-emerald-600">7일 후 만료</span>돼요.
        </p>
      </DialogContent>
    </Dialog>
  );
}
