// src/features/sessionSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  session: any | null; // 실제 사용자 객체 (user)
  isLoaded: boolean; // 세션 여부를 "한 번이라도 확인했는지"
  source: "supabase" | "fastapi" | null;
}

const initialState: SessionState = {
  session: null,
  isLoaded: false,
  source: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    // ✅ 항상 { user, source } 형태로 받는다
    setSession: (
      state,
      action: PayloadAction<{ user: any; source: "supabase" | "fastapi" }>,
    ) => {
      state.session = action.payload.user; // 🟢 user만 저장
      state.source = action.payload.source;
      state.isLoaded = true; // 🟢 세션 로딩 완료
    },
    clearSession: (state) => {
      state.session = null;
      state.source = null;
      state.isLoaded = true; // 🟢 "없다는 것"도 확인 완료
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
