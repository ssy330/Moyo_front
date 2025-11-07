import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current: "",
    newPw: "",
    confirmPw: "",
  });
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPw !== form.confirmPw) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    // 🔥 실제로는 FastAPI or Supabase updatePassword API 호출
    console.log("비밀번호 변경 요청:", form);
    alert("비밀번호가 성공적으로 변경되었습니다!");
    setForm({ current: "", newPw: "", confirmPw: "" });
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-emerald-600">
        <Lock className="h-6 w-6" />
        비밀번호 변경
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 현재 비밀번호 */}
        <div className="space-y-2">
          <Label htmlFor="current">현재 비밀번호</Label>

          {/* AuthInput으로 바꿔야하긴함. */}
          <Input
            id="current"
            name="current"
            type={showPw ? "text" : "password"}
            placeholder="현재 비밀번호를 입력하세요"
            value={form.current}
            onChange={handleChange}
            required
          />
        </div>

        {/* 새 비밀번호 */}
        <div className="space-y-2">
          <Label htmlFor="newPw">새 비밀번호</Label>
          <Input
            id="newPw"
            name="newPw"
            type={showPw ? "text" : "password"}
            placeholder="8자 이상, 영문+숫자 조합"
            value={form.newPw}
            onChange={handleChange}
            required
          />
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="space-y-2">
          <Label htmlFor="confirmPw">새 비밀번호 확인</Label>
          <Input
            id="confirmPw"
            name="confirmPw"
            type={showPw ? "text" : "password"}
            placeholder="한 번 더 입력해주세요"
            value={form.confirmPw}
            onChange={handleChange}
            required
          />
        </div>

        {/* 비밀번호 보기 토글 */}
        <div
          className="flex cursor-pointer items-center justify-end gap-2 text-sm text-neutral-500 select-none hover:text-neutral-700"
          onClick={() => setShowPw((prev) => !prev)}
        >
          {showPw ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span>{showPw ? "비밀번호 숨기기" : "비밀번호 보기"}</span>
        </div>

        <Separator />

        {/* 제출 버튼 */}
        <Button
          type="submit"
          className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
        >
          비밀번호 변경하기
        </Button>
      </form>
    </div>
  );
}
