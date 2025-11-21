// src/api/invite.ts
import { api } from "@/lib/api";

// ✅ 초대코드 생성
export const createInvite = async (body: {
  purpose: string;
  payload?: Record<string, any> | string | null;
  maxUses: number;
  ttlMinutes: number;
}) => {
  const res = await api.post("/invites", body);
  return res.data;
};

// ✅ 초대코드 검증
export const verifyInvite = async (code: string) => {
  const res = await api.post("/invites/verify", { code });
  return res.data;
};

// ✅ 초대코드 사용(redeem)
export const redeemInvite = async (code: string) => {
  const res = await api.post("/invites/redeem", { code });
  return res.data;
};

// ✅ 초대코드 재발급(rotate)
export const rotateInvite = async (code: string) => {
  const res = await api.post("/invites/rotate", { code });
  return res.data;
};
