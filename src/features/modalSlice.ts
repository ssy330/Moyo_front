import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalData {
  postId?: number;
  content?: string;
  imageUrls?: string[] | null;
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
    // ✅ PayloadAction<ModalPayload> 로 변경
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
