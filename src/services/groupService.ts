import { api } from "@/lib/api";

export async function joinGroupByInvite(code: string) {
  const res = await api.post("/groups/join-by-invite", { code });
  return res.data; // { group: ... }
}
