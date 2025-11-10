import { api } from "./api";
import { setSession } from "@/features/sessionSlice";
import { MSGS } from "@/utils/messages";
import type { AxiosError } from "axios";
import { store } from "@/store/store"; // ✅ dispatch 위해 store 직접 임포트

// ✅ 순수 API 로직
export async function signInWithEmailApi(form: {
  email: string;
  password: string;
}) {
  try {
    const res = await api.post("/auth/login", form);
    const token = res.data.access_token;
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", res.data.refresh_token);

    // ✅ 유저 정보 요청
    const me = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Redux 상태 갱신
    store.dispatch(setSession(me.data));

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    const msg = axiosError.response?.data?.detail ?? MSGS.INVALID_CREDENTIALS;
    alert(msg);
    throw error;
  }
}
