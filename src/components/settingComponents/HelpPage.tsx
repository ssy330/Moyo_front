// src/pages/HelpPage.tsx
// shadcn ScrollArea 쓰는 버전
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="border-border bg-card/80 mx-auto w-full max-w-2xl rounded-2xl border p-6 shadow-lg backdrop-blur-sm sm:p-8">
      {/* 상단 헤더 영역 */}
      <header className="from-primary/15 via-primary/5 mb-6 flex items-start gap-3 rounded-xl bg-gradient-to-r to-transparent px-4 py-3">
        <div className="bg-primary/10 mt-0.5 flex h-10 w-10 items-center justify-center rounded-full">
          <HelpCircle className="text-primary h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium">
            <span className="bg-primary h-1.5 w-1.5 rounded-full" />
            빠르게 도움받고 싶다면
          </div>
          <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
            도움말 &amp; 자주 묻는 질문
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            자주 묻는 질문을 먼저 확인해 보시고, 해결되지 않으면 고객센터로
            문의해주세요.
          </p>
        </div>
      </header>

      {/* 빠른 안내 리스트 */}
      <section className="mb-5 space-y-2">
        <h3 className="text-muted-foreground text-xs font-semibold">
          이런 내용들을 확인하실 수 있어요
        </h3>
        <ul className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <li className="bg-muted text-foreground rounded-full px-3 py-1">
            앱 기본 사용 방법
          </li>
          <li className="bg-muted text-foreground rounded-full px-3 py-1">
            자주 묻는 질문 모음
          </li>
          <li className="bg-muted text-foreground rounded-full px-3 py-1">
            버그/오류 신고 방법
          </li>
        </ul>
        <p className="text-muted-foreground text-[11px] sm:text-xs">
          버그 신고 및 개별 상담이 필요하다면{" "}
          <span className="text-primary font-semibold">고객센터</span> 메뉴를
          이용해주세요.
        </p>
      </section>

      {/* FAQ 영역 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-primary h-4 w-4" />
            <h3 className="text-foreground text-sm font-semibold sm:text-base">
              자주 묻는 질문 (FAQ)
            </h3>
          </div>
          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-[10px] font-medium">
            상단을 눌러 접었다 펼칠 수 있어요
          </span>
        </div>

        {/* 내부 스크롤 영역 (카드 안에서만 스크롤, 안 삐져나오게) */}
        <ScrollArea className="border-border bg-muted/40 max-h-[340px] w-full overflow-x-hidden overflow-y-auto rounded-xl border px-3 py-3 sm:px-4 sm:py-3">
          <div className="space-y-3 pr-2">
            <details className="group border-border bg-background/80 hover:border-primary/60 rounded-lg border p-4 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
              <summary className="text-foreground flex cursor-pointer items-center justify-between text-sm font-medium">
                <span>비밀번호를 잊어버렸어요.</span>
                <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                로그인 화면의 &ldquo;비밀번호 찾기&rdquo;를 통해 이메일 인증 후
                새 비밀번호를 설정하실 수 있습니다.
              </p>
            </details>

            <details className="group border-border bg-background/80 hover:border-primary/60 rounded-lg border p-4 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
              <summary className="text-foreground flex cursor-pointer items-center justify-between text-sm font-medium">
                <span>결제 영수증은 어디서 확인할 수 있나요?</span>
                <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                결제 정보 페이지에서 &ldquo;영수증 다운로드&rdquo; 버튼을 통해
                바로 확인 가능합니다.
              </p>
            </details>

            <details className="group border-border bg-background/80 hover:border-primary/60 rounded-lg border p-4 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
              <summary className="text-foreground flex cursor-pointer items-center justify-between text-sm font-medium">
                <span>계정을 탈퇴하고 싶어요.</span>
                <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                프로필 설정 페이지 하단의 &ldquo;계정 탈퇴&rdquo; 버튼을 통해
                진행하실 수 있습니다. 탈퇴 시 모든 데이터가 삭제되니 신중히
                결정해주세요.
              </p>
            </details>

            <details className="group border-border bg-background/80 hover:border-primary/60 rounded-lg border p-4 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
              <summary className="text-foreground flex cursor-pointer items-center justify-between text-sm font-medium">
                <span>그룹 초대가 안 돼요.</span>
                <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                초대 코드의 유효 기간이 만료되었을 수 있습니다. 새 초대 코드를
                발급받아 다시 시도해주세요.
              </p>
            </details>
          </div>
        </ScrollArea>
      </section>
    </div>
  );
}
