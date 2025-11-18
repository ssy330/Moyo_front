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
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import axios from "axios";

type GroupJoinModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function GroupJoinModal({ open, onClose }: GroupJoinModalProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleClose = () => {
    setInviteCode(""); // 닫을 때 입력값도 초기화하고 싶으면
    onClose();
  };

  // 그룹 참여
  const handleJoin = async () => {
    const code = inviteCode.trim();
    if (!code) {
      toast.warning("초대 코드를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/groups/join-by-invite", { code });

      const group = res.data; // GroupDetailOut 형태라고 가정: { id, name, ... }

      toast.success(`"${group.name}" 그룹에 참가했어요!`);
      handleClose();

      // 그룹 상세 페이지로 이동
      nav(`/groups/${group.id}`);
    } catch (error) {
      let message = "초대 코드로 그룹 참가에 실패했어요.";

      if (axios.isAxiosError(error)) {
        const reason = error.response?.data?.detail;

        switch (reason) {
          case "NOT_FOUND":
            message = "존재하지 않는 초대 코드입니다.";
            break;
          case "EXPIRED":
            message = "만료된 초대 코드입니다.";
            break;
          case "EXHAUSTED":
            message = "사용 횟수가 모두 소진된 초대 코드입니다.";
            break;
          case "REVOKED":
            message = "관리자에 의해 취소된 초대 코드입니다.";
            break;
          case "INVALID_PURPOSE":
            message = "이 초대 코드는 그룹 참여용이 아닙니다.";
            break;
          case "BAD_PAYLOAD":
          case "GROUP_ID_MISSING":
          case "GROUP_NOT_FOUND":
            message = "이 초대 코드에 연결된 그룹 정보를 찾을 수 없습니다.";
            break;
        }
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-700">
            그룹 참가하기
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600">
            초대 코드를 입력하여 기존 그룹에 참가하세요.
          </DialogDescription>
        </DialogHeader>

        {/* 안내 문구 */}
        <div className="mb-6 text-center text-sm text-gray-500">
          초대 코드는 이렇게 생겼습니다:
          <br />
          <span className="text-blue-600">영문+숫자 6자리</span>
        </div>

        {/* 입력창 */}
        <div className="mb-6">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="여기에 초대 코드를 붙여 넣으세요"
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">초대 코드를 입력하세요</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-gray-600"
            disabled={loading}
          >
            취소
          </Button>

          <Button
            onClick={() => {
              handleJoin();
            }}
            disabled={loading}
          >
            {loading ? "참가 중..." : "참가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
