// src/hook/mutation/use-invite-mutation.ts
import { useMutation } from "@tanstack/react-query";
import {
  createInvite,
  verifyInvite,
  redeemInvite,
  rotateInvite,
  type CreateInviteIn,
  type VerifyIn,
  type RedeemIn,
  type InviteOut,
  type VerifyOut,
} from "@/lib/invite-api";

export function useCreateInvite() {
  return useMutation<InviteOut, any, CreateInviteIn>({
    mutationFn: createInvite,
  });
}

export function useVerifyInvite() {
  return useMutation<VerifyOut, any, VerifyIn>({
    mutationFn: verifyInvite,
  });
}

export function useRedeemInvite() {
  return useMutation<VerifyOut, any, RedeemIn>({
    mutationFn: redeemInvite,
  });
}

export function useRotateInvite() {
  return useMutation<InviteOut, any, string>({
    mutationFn: rotateInvite,
  });
}
