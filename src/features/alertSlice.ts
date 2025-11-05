// features/alertSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AlertState = {
  isOpen: boolean;
  title: string;
  description: string;
  onPositive?: () => void;
  onNegative?: () => void;
};

const initialState: AlertState = {
  isOpen: false,
  title: "",
  description: "",
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    // 🔔 알럿 열기
    openAlert(state, action: PayloadAction<Omit<AlertState, "isOpen">>) {
      state.isOpen = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.onPositive = action.payload.onPositive;
      state.onNegative = action.payload.onNegative;
    },

    // 🔕 알럿 닫기
    // ✅ state 파라미터만 있으니까 ActionCreatorWithoutPayload 로 추론됨
    closeAlert(state) {
      state.isOpen = false;
      state.title = "";
      state.description = "";
      state.onPositive = undefined;
      state.onNegative = undefined;
    },
  },
});

export const { openAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
