// src/features/sessionSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FastAPIUser {
  user_id: number;
  email?: string;
  username?: string;
}

interface SupabaseUser {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}

export type SessionUser = FastAPIUser | SupabaseUser;

export interface SessionState {
  session: SessionUser | null;
  isLoaded: boolean;
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
      action: PayloadAction<{
        user: SessionUser | null;
        source: "supabase" | "fastapi";
      }>,
    ) => {
      state.session = action.payload.user;
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
