import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  nickname: string;
  id: string;
  password: string;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  nickname: "",
  id: "",
  password: "",
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const { setNickname, setId, setPassword } = authSlice.actions;

export default authSlice.reducer;
