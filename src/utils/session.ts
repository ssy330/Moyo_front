import type { SessionUser } from "@/features/sessionSlice";

// ✅ 유저 ID 안전 추출 헬퍼
export function getUserId(
  session: SessionUser | null,
): string | number | undefined {
  if (!session) return undefined;
  if ("user_id" in session) return session.user_id; // FastAPI user
  if ("id" in session) return session.id; // Supabase user
  return undefined;
}
