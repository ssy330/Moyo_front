import { useMutation } from "@tanstack/react-query";
import {
  createInvite,
  verifyInvite,
  redeemInvite,
  rotateInvite,
} from "@/lib/invite";

export const useCreateInvite = () => useMutation({ mutationFn: createInvite });
export const useVerifyInvite = () => useMutation({ mutationFn: verifyInvite });
export const useRedeemInvite = () => useMutation({ mutationFn: redeemInvite });
export const useRotateInvite = () => useMutation({ mutationFn: rotateInvite });
