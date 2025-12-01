import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, HelpCircle } from "lucide-react";
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
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-primary h-5 w-5" />
            <h3 className="text-foreground text-sm font-semibold md:text-base">
              자주 묻는 질문 (FAQ)
            </h3>
          </div>

          {/* 내부 스크롤 영역 */}
          <ScrollArea className="border-border bg-muted/40 max-h-[260px] rounded-xl border px-4 py-3">
            <div className="space-y-3 pr-2">
              <details className="bg-card rounded-lg p-4 shadow-xs">
                <summary className="text-foreground cursor-pointer text-sm font-medium">
                  비밀번호를 잊어버렸어요.
                </summary>
                <p className="text-muted-foreground mt-2 text-xs md:text-sm">
                  로그인 화면의 &ldquo;비밀번호 찾기&rdquo;를 통해 이메일 인증
                  후 새 비밀번호를 설정하실 수 있습니다.
                </p>
              </details>

              <details className="bg-card rounded-lg p-4 shadow-xs">
                <summary className="text-foreground cursor-pointer text-sm font-medium">
                  결제 영수증은 어디서 확인할 수 있나요?
                </summary>
                <p className="text-muted-foreground mt-2 text-xs md:text-sm">
                  결제 정보 페이지에서 &ldquo;영수증 다운로드&rdquo; 버튼을 통해
                  바로 확인 가능합니다.
                </p>
              </details>

              <details className="bg-card rounded-lg p-4 shadow-xs">
                <summary className="text-foreground cursor-pointer text-sm font-medium">
                  계정을 탈퇴하고 싶어요.
                </summary>
                <p className="text-muted-foreground mt-2 text-xs md:text-sm">
                  프로필 설정 페이지 하단의 &ldquo;계정 탈퇴&rdquo; 버튼을 통해
                  진행하실 수 있습니다. 탈퇴 시 모든 데이터가 삭제되니 신중히
                  결정해주세요.
                </p>
              </details>

              <details className="bg-card rounded-lg p-4 shadow-xs">
                <summary className="text-foreground cursor-pointer text-sm font-medium">
                  그룹 초대가 안 돼요.
                </summary>
                <p className="text-muted-foreground mt-2 text-xs md:text-sm">
                  초대 코드의 유효 기간이 만료되었을 수 있습니다. 새 초대 코드를
                  발급받아 다시 시도해주세요.
                </p>
              </details>
            </div>
          </ScrollArea>
        </section>

        <p className="text-muted-foreground mt-6 text-xs md:text-sm">
          ✉️ 추가 문의:{" "}
          <span className="text-primary font-medium">support@moyo.gg</span>
        </p>
      </div>
    </div>
  );
}
