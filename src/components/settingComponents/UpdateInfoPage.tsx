import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";

type UpdateLog = {
  version: string;
  date: string;
  highlights: string[];
};

export default function UpdateInfoPage() {
  const updates: UpdateLog[] = [
    {
      version: "v2.3.0",
      date: "2025-11-01",
      highlights: [
        "🎉 그룹 채팅 기능 정식 출시",
        "📸 게시글에 이미지 여러 장 업로드 가능",
        "🪄 로그인/회원가입 화면 UI 개선",
        "🐛 일부 모바일 환경에서 발생하던 레이아웃 깨짐 수정",
      ],
    },
    {
      version: "v2.2.1",
      date: "2025-10-10",
      highlights: [
        "💬 댓글 알림 기능 추가",
        "🔔 알림 페이지 UX 개선",
        "⚡️ 성능 최적화 (로딩 속도 15% 향상)",
      ],
    },
    {
      version: "v2.1.0",
      date: "2025-09-05",
      highlights: [
        "👤 프로필 편집 페이지 개편",
        "🖼️ 그룹 커버 이미지 변경 기능 추가",
        "🔒 비밀번호 변경 시 유효성 검사 강화",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-emerald-600">
        <History className="h-6 w-6" />
        업데이트 정보
      </h2>

      <ScrollArea className="h-[70vh] pr-4">
        <div className="space-y-10">
          {updates.map((log) => (
            <section key={log.version} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {log.version}
                </h3>
                <span className="text-sm text-neutral-500">{log.date}</span>
              </div>
              <ul className="list-disc space-y-1 pl-6 text-sm text-neutral-700">
                {log.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <Separator className="mt-4" />
            </section>
          ))}
        </div>
      </ScrollArea>

      <p className="mt-6 text-sm text-neutral-500">
        📅 최신 업데이트: {updates[0].date} ({updates[0].version})
      </p>
    </div>
  );
}
