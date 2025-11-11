// 공용 로그아웃 유틸: SDK만 사용 + 로컬 세션/토큰 완전 정리
import supabase from "@/lib/supabase";

/**
 * Supabase + 로컬 저장소를 완전히 정리하는 안전한 로그아웃
 * - 다른 기기 포함 완전 로그아웃(scope: 'global')
 * - sb-... 세션 키 및 우리 측 access_token 제거
 * - 에러는 throw하지 않고 false 반환 (버튼 UX를 위해)
 */
export async function safeLogout(): Promise<boolean> {
  try {
    // 1) 세션 있을 때만 SDK로 로그아웃 (Edge 403 방지)
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) console.warn("supabase signOut:", error.message);
    }

    // 2) 저장소 정리 (브라우저/프로필 간 세션 꼬임 방지)
    Object.keys(localStorage)
      .filter((k) => k.startsWith("sb-"))
      .forEach((k) => localStorage.removeItem(k));

    // 우리 백엔드 토큰 키 정리 (프로젝트에 맞춰 둘 다 제거)
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");

    return true;
  } catch (e) {
    console.error("safeLogout error:", e);
    return false;
  }
}
