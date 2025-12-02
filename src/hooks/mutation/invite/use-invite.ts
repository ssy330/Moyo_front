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
import type { AxiosError } from "axios";

export function useCreateInvite() {
  return useMutation<InviteOut, AxiosError, CreateInviteIn>({
    mutationFn: createInvite,
  });
}

export function useVerifyInvite() {
  return useMutation<VerifyOut, AxiosError, VerifyIn>({
    mutationFn: verifyInvite,
  });
}

export function useRedeemInvite() {
  return useMutation<VerifyOut, AxiosError, RedeemIn>({
    mutationFn: redeemInvite,
  });
}

export function useRotateInvite() {
  return useMutation<InviteOut, AxiosError, string>({
    mutationFn: rotateInvite,
  });
}
