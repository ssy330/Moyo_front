import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppThemeId = "green" | "dark" | "ocean" | "lavender" | "rose";

type ThemeState = {
  current: AppThemeId;
};

const initialState: ThemeState = {
  current: "green", // 기본 테마
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<AppThemeId>) {
      state.current = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
