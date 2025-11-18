import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  id: number | null;
  name: string;
  nickname: string;
  email: string;
  password: string;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  id: null,
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
    setId: (state, action: PayloadAction<number | null>) => {
      state.id = action.payload;
    },
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

export const { setId, setName, setNickname, setEmail, setPassword } =
  authSlice.actions;

export default authSlice.reducer;
