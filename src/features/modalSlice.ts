// src/features/modalSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalData {
  id?: number;
  content?: string;
  image_urls?: string[] | null;
  groupId?: number; // 🔥 글쓰기 모달에서 사용할 groupId 추가
}

interface ModalPayload {
  type: "invite" | "groupSetting" | "write" | "groupJoin" | "edit";
  data?: ModalData;
}

interface ModalState {
  currentModal: ModalPayload | null;
}

const initialState: ModalState = {
  currentModal: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // ✅ PayloadAction<ModalPayload>
    openModal: (state, action: PayloadAction<ModalPayload>) => {
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.currentModal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
