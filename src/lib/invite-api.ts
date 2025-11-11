// src/lib/invite-api.ts
import { api } from "@/lib/api";

// ====== 타입 (백엔드 스키마 대응) ======
export type InvitePurpose = "group_join" | "etc"; // 필요하면 확장

export interface CreateInviteIn {
  purpose: InvitePurpose;
  payload?: Record<string, any> | string | null; // 객체로 받되 내부에서 문자열화
  maxUses?: number;   // <= 0 또는 undefined면 무제한
  ttlMinutes?: number; // 만료분
}

export interface InviteOut {
  code: string;
  purpose: string;
  usesLeft: number | null; // 무제한이면 null
  expiresAt: string | null; // ISO8601
}

export interface VerifyIn {
  code: string;
}
export interface VerifyOut {
  valid: boolean;
  reason?: string | null;
  purpose?: string;
  payload?: any;
  usesLeft?: number | null;
}

export interface RedeemIn {
  code: string;
}

// ====== helpers ======
function ensureStringPayload(p: CreateInviteIn["payload"]) {
  if (p == null) return null;
  if (typeof p === "string") return p;
  try {
    return JSON.stringify(p);
  } catch {
    return null;
  }
}

// ====== API ======
export async function createInvite(body: CreateInviteIn) {
  const res = await api.post<InviteOut>("/invites", {
    purpose: body.purpose,
    payload: ensureStringPayload(body.payload),
    maxUses: body.maxUses ?? 1,
    ttlMinutes: body.ttlMinutes ?? 60,
  });
  return res.data;
}

export async function verifyInvite(body: VerifyIn) {
  const res = await api.post<VerifyOut>("/invites/verify", body);
  return res.data;
}

export async function redeemInvite(body: RedeemIn) {
  const res = await api.post<VerifyOut>("/invites/redeem", body);
  return res.data;
}

export async function rotateInvite(code: string) {
  const res = await api.post<InviteOut>("/invites/rotate", { code });
  return res.data;
}
