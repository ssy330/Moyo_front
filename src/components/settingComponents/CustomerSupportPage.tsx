import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
      toast("모든 항목을 입력해주세요.");
      return;
    }
    // 🔥 실제로는 문의 API (예: FastAPI / Supabase RPC) 호출
    console.log("문의 전송:", form);
    alert("문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다!");
    setForm({ email: "", title: "", content: "" });
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-emerald-600">
        <MessageCircle className="h-6 w-6" />
        고객센터
      </h2>
      {/* 문의하기 섹션 */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
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

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
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

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            내용
          </label>
          <Textarea
            name="content"
            placeholder="불편사항, 개선의견, 문의 내용을 자세히 작성해주세요."
            value={form.content}
            onChange={handleChange}
            rows={6}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
        >
          문의 보내기
        </Button>
      </form>
      <Separator className="my-8" />
      {/* FAQ 섹션 */}

      <section className="space-y-6">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-neutral-800">
          <HelpCircle className="h-5 w-5 text-emerald-500" />
          자주 묻는 질문 (FAQ)
        </h3>

        {/* ✅ 내부 스크롤 영역 추가 */}
        <ScrollArea className="max-h-[300px] rounded-md border border-neutral-200 bg-neutral-50 p-4">
          <div className="space-y-4 pr-4">
            <details className="rounded-md bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-medium text-neutral-800">
                비밀번호를 잊어버렸어요.
              </summary>
              <p className="mt-2 text-sm text-neutral-600">
                로그인 화면의 “비밀번호 찾기”를 통해 이메일 인증 후 새
                비밀번호를 설정하실 수 있습니다.
              </p>
            </details>

            <details className="rounded-md bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-medium text-neutral-800">
                결제 영수증은 어디서 확인할 수 있나요?
              </summary>
              <p className="mt-2 text-sm text-neutral-600">
                결제 정보 페이지에서 “영수증 다운로드” 버튼을 통해 바로 확인
                가능합니다.
              </p>
            </details>

            <details className="rounded-md bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-medium text-neutral-800">
                계정을 탈퇴하고 싶어요.
              </summary>
              <p className="mt-2 text-sm text-neutral-600">
                프로필 설정 페이지 하단의 “계정 탈퇴” 버튼을 통해 진행하실 수
                있습니다. 탈퇴 시 모든 데이터가 삭제되니 신중히 결정해주세요.
              </p>
            </details>

            <details className="rounded-md bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-medium text-neutral-800">
                그룹 초대가 안 돼요.
              </summary>
              <p className="mt-2 text-sm text-neutral-600">
                초대 코드의 유효 기간이 만료되었을 수 있습니다. 새 초대 코드를
                발급받아 다시 시도해주세요.
              </p>
            </details>
          </div>
        </ScrollArea>
      </section>
      <p className="mt-8 text-sm text-neutral-500">
        ✉️ 추가 문의:{" "}
        <span className="font-medium text-emerald-600">support@moyo.gg</span>
      </p>
    </div>
  );
}
