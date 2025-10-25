import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "@/features/groupSlice";
import authSliceReducer from "@/features/authSlice";

export const store = configureStore({
  reducer: {
    group: groupReducer,
    auth: authSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
