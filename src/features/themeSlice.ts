// src/features/themeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppThemeId = "green" | "dark" | "ocean" | "lavender" | "rose";

type ThemeState = {
  current: AppThemeId;
};

const STORAGE_KEY = "moyo.appTheme";
const DEFAULT_THEME: AppThemeId = "green";

// 브라우저에서만 localStorage 읽기
function getInitialTheme(): AppThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;

  const stored = window.localStorage.getItem(STORAGE_KEY) as AppThemeId | null;

  if (
    stored &&
    ["green", "dark", "ocean", "lavender", "rose"].includes(stored)
  ) {
    return stored;
  }
  return DEFAULT_THEME;
}

const initialState: ThemeState = {
  current: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<AppThemeId>) {
      state.current = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, action.payload);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
