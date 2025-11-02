import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  name: string;
  nickname: string;
  email: string;
  password: string;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  name: "",
  nickname: "",
  email: "",
  password: "",
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
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

export const { setName, setNickname, setEmail, setPassword } =
  authSlice.actions;

export default authSlice.reducer;
