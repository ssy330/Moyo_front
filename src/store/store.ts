import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "@/features/groupSlice";
import authSliceReducer from "@/features/authSlice";
import sessionSliceReducer from "@/features/sessionSlice";
import modalSliceReducer from "@/features/modalSlice";

export const store = configureStore({
  reducer: {
    group: groupReducer,
    auth: authSliceReducer,
    session: sessionSliceReducer,
    modal: modalSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
