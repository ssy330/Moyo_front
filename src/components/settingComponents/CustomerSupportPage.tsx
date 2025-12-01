import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function CustomerSupportPage() {
  const [form, setForm] = useState({
    email: "",
    title: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.title || !form.content) {
      toast.warning("모든 항목을 입력해주세요.");
      return;
    }

    // 🔥 실제로는 문의 API 호출
    console.log("문의 전송:", form);

    toast.success("문의가 접수되었습니다. 빠른 시일 내에 답변드릴게요.");
    setForm({ email: "", title: "", content: "" });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="border-border bg-card rounded-2xl border px-6 py-6 shadow-sm md:px-8 md:py-7">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl">
              <MessageCircle className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-semibold md:text-xl">
                고객센터
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                불편사항이나 문의를 남겨주시면 최대한 빠르게 답변드릴게요.
              </p>
            </div>
          </div>
        </div>

        {/* 문의하기 섹션 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-foreground block text-xs font-medium md:text-sm">
              이메일
            </label>
            <Input
              type="email"
              name="email"
              placeholder="답변 받을 이메일을 입력해주세요"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground block text-xs font-medium md:text-sm">
              제목
            </label>
            <Input
              type="text"
              name="title"
              placeholder="문의 제목을 입력해주세요"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground block text-xs font-medium md:text-sm">
              내용
            </label>
            <Textarea
              name="content"
              placeholder="불편사항, 개선 의견 등 문의 내용을 자세히 작성해주세요."
              value={form.content}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <Button type="submit" className="mt-2 w-full">
            문의 보내기
          </Button>
        </form>

        <Separator className="my-8" />

        {/* FAQ 섹션 */}

        <p className="text-muted-foreground mt-6 text-xs md:text-sm">
          ✉️ 추가 문의:{" "}
          <span className="text-primary font-medium">support@moyo.gg</span>
        </p>
      </div>
    </div>
  );
}
