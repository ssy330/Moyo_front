import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type GroupState = {
  id: number;
  groupName: string;
  signNow: boolean;
  onlyNickName: boolean;
  groupsDescription: string;
  privacyPolicy: boolean;
  groupsImg?: string;
};

const initialState: GroupState = {
  id: Date.now(),
  groupName: "",
  signNow: true,
  onlyNickName: false,
  groupsDescription: "",
  privacyPolicy: false,
  groupsImg: "",
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroupName: (state, action: PayloadAction<string>) => {
      state.groupName = action.payload;
    },
    setSignNow: (state, action: PayloadAction<boolean>) => {
      state.signNow = action.payload;
    },
    setOnlyNickName: (state, action: PayloadAction<boolean>) => {
      state.onlyNickName = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.groupsDescription = action.payload;
    },
    setPrivacyPolicy: (state, action: PayloadAction<boolean>) => {
      state.privacyPolicy = action.payload;
    },
    setGroupImg: (state, action: PayloadAction<string>) => {
      state.groupsImg = action.payload;
    },
  },
});

export const {
  setGroupName,
  setSignNow,
  setOnlyNickName,
  setDescription,
  setPrivacyPolicy,
  setGroupImg,
} = groupSlice.actions;

export default groupSlice.reducer;
