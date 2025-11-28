import type { AppThemeId } from "@/features/themeSlice";

// 🔹 AppLayout에만 쓸 색상 프리셋 타입
type ThemeConfig = {
  sidebar: string; // 사이드바 배경/보더
  main: string; // 메인 배경
  logoButton: string;
  logoText: string;
  profileButton: string;
  profileIcon: string;
  notifButton: string;
  notifIcon: string;
  calendarButton: string;
  calendarIcon: string;
  settingsButton: string;
  settingsIcon: string;
};

// 🔹 여러 테마 프리셋 정의
export const APP_LAYOUT_THEMES: Record<AppThemeId, ThemeConfig> = {
  // 기본 그린 테마
  green: {
    sidebar: "border-green-100 bg-green-50",
    main: "bg-gray-50",
    logoButton: "bg-green-200 hover:bg-green-300",
    logoText: "text-gray-800",
    profileButton: "bg-sky-200 hover:bg-sky-300",
    profileIcon: "text-sky-800",
    notifButton: "bg-yellow-200 hover:bg-yellow-300",
    notifIcon: "text-yellow-700",
    calendarButton: "bg-green-200 hover:bg-green-300",
    calendarIcon: "text-green-700",
    settingsButton: "bg-neutral-100 hover:bg-neutral-200",
    settingsIcon: "text-gray-600",
  },

  // ⚫️⬜️ 다크(검정-흰색 위주) 테마
  dark: {
    sidebar: "border-neutral-800 bg-neutral-950",
    main: "bg-white",
    logoButton: "bg-neutral-800 hover:bg-neutral-700",
    logoText: "text-neutral-100",
    profileButton: "bg-neutral-800 hover:bg-neutral-700",
    profileIcon: "text-neutral-100",
    notifButton: "bg-neutral-800 hover:bg-neutral-700",
    notifIcon: "text-neutral-100",
    calendarButton: "bg-neutral-800 hover:bg-neutral-700",
    calendarIcon: "text-neutral-100",
    settingsButton: "bg-neutral-800 hover:bg-neutral-700",
    settingsIcon: "text-neutral-200",
  },

  // 바다 느낌 테마
  ocean: {
    sidebar: "border-sky-200 bg-sky-50",
    main: "bg-sky-50",
    logoButton: "bg-sky-300 hover:bg-sky-400",
    logoText: "text-sky-950",
    profileButton: "bg-cyan-200 hover:bg-cyan-300",
    profileIcon: "text-cyan-900",
    notifButton: "bg-emerald-200 hover:bg-emerald-300",
    notifIcon: "text-emerald-800",
    calendarButton: "bg-sky-200 hover:bg-sky-300",
    calendarIcon: "text-sky-900",
    settingsButton: "bg-white/80 hover:bg-white",
    settingsIcon: "text-sky-900",
  },

  // 보라/핑크 테마
  lavender: {
    sidebar: "border-purple-200 bg-purple-50",
    main: "bg-purple-50",
    logoButton: "bg-purple-300 hover:bg-purple-400",
    logoText: "text-purple-950",
    profileButton: "bg-pink-200 hover:bg-pink-300",
    profileIcon: "text-pink-900",
    notifButton: "bg-amber-200 hover:bg-amber-300",
    notifIcon: "text-amber-800",
    calendarButton: "bg-violet-200 hover:bg-violet-300",
    calendarIcon: "text-violet-900",
    settingsButton: "bg-white/80 hover:bg-white",
    settingsIcon: "text-purple-900",
  },
  rose: {
    sidebar: "border-rose-200 bg-rose-50",
    main: "bg-rose-50",
    logoButton: "bg-rose-300 hover:bg-rose-400",
    logoText: "text-rose-950",
    profileButton: "bg-pink-200 hover:bg-pink-300",
    profileIcon: "text-pink-900",
    notifButton: "bg-red-200 hover:bg-red-300",
    notifIcon: "text-red-800",
    calendarButton: "bg-rose-200 hover:bg-rose-300",
    calendarIcon: "text-rose-900",
    settingsButton: "bg-white/80 hover:bg-white",
    settingsIcon: "text-rose-900",
  },
};
