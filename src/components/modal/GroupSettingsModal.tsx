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
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { closeModal } from "@/features/modalSlice";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function GroupSettingModal() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.modal.currentModal === "groupSetting",
  );

  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupImage, setGroupImage] = useState<File | null>(null);

  const handleLeaveGroup = () => {
    if (confirm("정말 이 그룹을 탈퇴하시겠습니까?")) {
      // 🔥 그룹 탈퇴 로직 추가 (API 연동 시 사용)
      console.log("탈퇴 완료");
      dispatch(closeModal());
    }
  };

  const handleSave = () => {
    // 🔥 저장 로직 추가 (예: updateGroup API 호출)
    console.log("그룹 설정 저장:", { groupName, groupDesc, groupImage });
    dispatch(closeModal());
  };

  return (
    <Dialog open={open} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl font-semibold">
            ⚙️ 그룹 설정
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            그룹 이름, 소개, 이미지를 수정하고 그룹을 관리할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 그룹 기본 정보 섹션 */}
        <section className="space-y-4 py-4">
          <h3 className="text-lg font-medium text-neutral-800">기본 정보</h3>
          <Separator />
          <div className="space-y-2">
            {groupImage && (
              <p className="text-xs text-neutral-500">
                선택된 파일: {groupImage.name}
              </p>
            )}
            <Label htmlFor="group-image">그룹 이미지</Label>
            <Input
              id="group-image"
              type="file"
              accept="image/*"
              onChange={(e) => setGroupImage(e.target.files?.[0] ?? null)}
              className="cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-name">그룹 이름</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="예: MOYO 그룹"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-desc">그룹 소개</Label>
            <Textarea
              id="group-desc"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              placeholder="그룹에 대한 설명을 입력해주세요."
              rows={4}
            />
          </div>
        </section>

        {/* 고급 설정 섹션 */}
        <section className="space-y-4 py-6">
          <h3 className="text-lg font-medium text-neutral-800">고급 설정</h3>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-600">그룹 탈퇴</p>
              <p className="text-sm text-neutral-500">
                이 그룹에서 탈퇴하면 다시 초대를 받아야 참여할 수 있습니다.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLeaveGroup}
              className="gap-2 text-white"
            >
              <Trash2 className="h-4 w-4" />
              그룹 탈퇴
            </Button>
          </div>
        </section>

        <DialogFooter className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
          >
            변경사항 저장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
