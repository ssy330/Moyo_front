import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

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
      toast("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    // 🔥 실제로는 FastAPI or Supabase updatePassword API 호출
    console.log("비밀번호 변경 요청:", form);
    toast("비밀번호가 성공적으로 변경되었습니다!");
    setForm({ current: "", newPw: "", confirmPw: "" });
  };

  return (
    <div className="border-border bg-card mx-auto max-w-xl rounded-2xl border p-8 shadow-sm">
      <h2 className="text-foreground mb-6 flex items-center gap-2 text-2xl font-bold">
        <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
          <Lock className="h-4 w-4" />
        </span>
        비밀번호 변경
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 현재 비밀번호 */}
        <div className="space-y-2">
          <Label htmlFor="current">현재 비밀번호</Label>
          {/* 나중에 AuthInput으로 교체 예정 */}
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
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground ml-auto flex items-center gap-2 text-sm select-none"
          onClick={() => setShowPw((prev) => !prev)}
        >
          {showPw ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span>{showPw ? "비밀번호 숨기기" : "비밀번호 보기"}</span>
        </button>

        <Separator />

        {/* 제출 버튼 */}
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
        >
          비밀번호 변경하기
        </Button>
      </form>
    </div>
  );
}
