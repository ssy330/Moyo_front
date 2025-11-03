import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { closeModal } from "@/features/modalSlice";

export default function GroupSettingModal() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.modal.currentModal === "groupSetting",
  );
  return (
    <Dialog open={open} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl font-semibold">
            ⚙️ 그룹 설정
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            그룹 이름, 소개, 이미지를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="group-name">그룹 이름</Label>
            <Input id="group-name" placeholder="예: MOYO 그룹" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="group-desc">그룹 소개</Label>
            <Textarea
              id="group-desc"
              placeholder="그룹에 대한 설명을 입력해주세요."
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="group-image">그룹 이미지</Label>
            <Input id="group-image" type="file" className="cursor-pointer" />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
          >
            저장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
