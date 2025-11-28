import { useDispatch, useSelector } from "react-redux";
import { setTheme, type AppThemeId } from "@/features/themeSlice";
import type { RootState } from "@/store/store";

const themeOptions: { id: AppThemeId; label: string }[] = [
  { id: "green", label: "기본 그린" },
  { id: "dark", label: "다크" },
  { id: "ocean", label: "오션 블루" },
  { id: "lavender", label: "라벤더" },
  { id: "rose", label: "로즈" },
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
        <h2 className="text-sm font-medium text-gray-700">
          앱 테마를 선택할 수 있습니다.
        </h2>
        <div className="flex flex-wrap gap-2">
          {themeOptions.map((t) => (
            <button
              key={t.id}
              onClick={() => handleChange(t.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                current === t.id
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
