import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { closeModal } from "@/features/modalSlice";

export default function GroupJoinModal() {
  const [inviteCode, setInviteCode] = useState("");
  const dispatch = useDispatch();

  // Redux 상태 관리
  const open = useSelector(
    (state: RootState) => state.modal.currentModal?.type === "groupJoin",
  );

  // 모달 닫기 함수
  const handleClose = () => dispatch(closeModal());

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
          >
            취소
          </Button>

          <Button
            onClick={() => {
              alert(`참여 코드: ${inviteCode}`);
              handleClose();
            }}
          >
            참가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
