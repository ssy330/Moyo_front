import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  nickname: string;
  email: string;
  password: string;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  nickname: "",
  email: "",
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
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const { setNickname, setEmail, setPassword } = authSlice.actions;

export default authSlice.reducer;
