import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";

interface SessionState {
  isLoaded: boolean;
  session: Session | null;
}

const initialState: SessionState = {
  isLoaded: false,
  session: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.isLoaded = true;
    },
    clearSession: (state) => {
      state.session = null;
      state.isLoaded = false;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
