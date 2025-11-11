// src/lib/auth-api.ts
import { api } from "@/lib/api";

/** 백엔드 스펙에 맞는 회원가입 바디 */
export type SignupBody = {
  email: string;
  name: string;  
  nickname: string;
  password: string;
};

/** /auth/signup 응답 */
export type SignupOut = {
  message: string;
  user_id: number;
};

/** 회원가입 */
export async function postSignup(body: SignupBody): Promise<SignupOut> {
  const { data } = await api.post<SignupOut>("/auth/signup", body);
  return data;
}

/** 이메일 인증코드 전송 */
export async function postSendCode(email: string) {
  const { data } = await api.post("/auth/email/send", { email });
  return data;
}

/** 이메일 인증코드 확인 */
export async function postVerifyCode(params: { email: string; code: string }) {
  const { data } = await api.post("/auth/email/verify", params);
  return data;
}
