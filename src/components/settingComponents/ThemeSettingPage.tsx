// src/pages/settings/ThemeSettingsPage.tsx (경로는 네 프로젝트에 맞춰서)

import { useDispatch, useSelector } from "react-redux";
import { setTheme, type AppThemeId } from "@/features/themeSlice";
import type { RootState } from "@/store/store";

// 카드별 메타 정보: 라벨, 설명, 미리보기 색 조합
type ThemeOption = {
  id: AppThemeId;
  label: string;
  description: string;
  previewClass: string; // 미리보기 박스에 들어갈 tailwind class
};

const themeOptions: ThemeOption[] = [
  {
    id: "green",
    label: "기본 그린",
    description: "밝고 편안한 기본 테마",
    previewClass:
      "bg-gradient-to-br from-emerald-400 via-emerald-300 to-lime-300",
  },
  {
    id: "dark",
    label: "다크",
    description: "눈이 편한 다크 모드",
    previewClass:
      "bg-gradient-to-br from-neutral-900 via-neutral-800 to-zinc-700",
  },
  {
    id: "ocean",
    label: "오션 블루",
    description: "시원한 파란 계열 테마",
    previewClass: "bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500",
  },
  {
    id: "lavender",
    label: "라벤더",
    description: "부드러운 보라 계열 테마",
    previewClass:
      "bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400",
  },
  {
    id: "rose",
    label: "로즈",
    description: "사랑스러운 핑크/레드 계열",
    previewClass: "bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500",
  },
];

export default function ThemeSettingsPage() {
  const dispatch = useDispatch();
  const current = useSelector((state: RootState) => state.theme.current);

  const handleChange = (id: AppThemeId) => {
    dispatch(setTheme(id));
  };

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">설정</h1>

      <section className="space-y-2">
        <h2 className="text-muted-foreground text-sm font-medium">
          앱 전체에 적용될 테마를 선택하세요.
        </h2>
        <p className="text-muted-foreground text-xs">
          카드 위의 색상 미리보기를 보고 원하는 무드의 테마를 골라보세요.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themeOptions.map((t) => {
            const isActive = current === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleChange(t.id)}
                className={`group focus-visible:ring-primary flex flex-col rounded-2xl border p-4 text-left shadow-sm transition focus-visible:ring-2 focus-visible:outline-none ${
                  isActive
                    ? "border-primary bg-card ring-primary/60 ring-2"
                    : "border-border bg-card hover:border-primary/50 hover:bg-muted/70"
                }`}
              >
                {/* 상단 미리보기 박스 */}
                <div
                  className={`mb-3 h-16 w-full rounded-xl ${t.previewClass}`}
                />

                {/* 이름 + 설명 + 선택 상태 */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-foreground text-sm font-semibold">
                      {t.label}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {t.description}
                    </div>
                  </div>

                  {isActive && (
                    <span className="bg-primary text-primary-foreground mt-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full text-[11px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
