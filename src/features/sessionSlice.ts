// src/features/sessionSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FastAPIUser {
  user_id: number; // 백엔드 /auth/me 응답에 맞춰서
  email?: string;
  name?: string; // ✅ 추가
  nickname?: string;
}

export type SessionUser = FastAPIUser;

export interface SessionState {
  session: SessionUser | null;
  isLoaded: boolean;
  source: "fastapi" | null;
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
    setSession: (
      state,
      action: PayloadAction<{
        user: SessionUser | null;
        source: "fastapi";
      }>,
    ) => {
      state.session = action.payload.user;
      state.source = action.payload.source;
      state.isLoaded = true; // 세션 로딩 완료
    },
    clearSession: (state) => {
      state.session = null;
      state.source = null;
      state.isLoaded = true; // "없다"는 것도 확인 완료
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
