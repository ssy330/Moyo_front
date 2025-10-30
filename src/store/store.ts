import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "@/features/groupSlice";
import authSliceReducer from "@/features/authSlice";
import sessionReducer from "@/features/sessionSlice";

export const store = configureStore({
  reducer: {
    group: groupReducer,
    auth: authSliceReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
