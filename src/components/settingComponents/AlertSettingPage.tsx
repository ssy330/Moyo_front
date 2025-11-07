import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AlertSettingPage() {
  const [settings, setSettings] = useState({
    group: true,
    chat: true,
    comment: false,
    notice: true,
    system: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-emerald-600">🔔 알림 설정</h2>

      <div className="space-y-6">
        {/* 그룹 알림 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-neutral-800">그룹 알림</Label>
            <p className="text-sm text-neutral-500">
              내가 속한 그룹의 새로운 게시글이나 공지사항 알림
            </p>
          </div>
          <Switch
            checked={settings.group}
            onCheckedChange={() => handleToggle("group")}
          />
        </div>
        <Separator />

        {/* 채팅 알림 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-neutral-800">채팅 알림</Label>
            <p className="text-sm text-neutral-500">
              1:1 또는 그룹 채팅의 새 메시지 알림
            </p>
          </div>
          <Switch
            checked={settings.chat}
            onCheckedChange={() => handleToggle("chat")}
          />
        </div>
        <Separator />

        {/* 댓글 알림 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-neutral-800">댓글 알림</Label>
            <p className="text-sm text-neutral-500">
              내가 작성한 글에 달린 새로운 댓글 알림
            </p>
          </div>
          <Switch
            checked={settings.comment}
            onCheckedChange={() => handleToggle("comment")}
          />
        </div>
        <Separator />

        {/* 공지 알림 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-neutral-800">
              공지사항 알림
            </Label>
            <p className="text-sm text-neutral-500">
              서비스 업데이트 및 이벤트 공지
            </p>
          </div>
          <Switch
            checked={settings.notice}
            onCheckedChange={() => handleToggle("notice")}
          />
        </div>
        <Separator />

        {/* 시스템 알림 */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-neutral-800">시스템 알림</Label>
            <p className="text-sm text-neutral-500">
              로그인, 보안 등 계정 관련 시스템 메시지
            </p>
          </div>
          <Switch
            checked={settings.system}
            onCheckedChange={() => handleToggle("system")}
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="mt-8 flex justify-end">
        <button
          className="rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white hover:bg-emerald-600"
          onClick={() => alert("알림 설정이 저장되었습니다.")}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
