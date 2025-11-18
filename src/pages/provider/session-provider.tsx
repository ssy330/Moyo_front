import GlobalLoader from "@/components/layouts/global-loader";
import { api } from "@/lib/api";
import type { RootState } from "@/store/store";
import { clearSession, setSession } from "@/features/sessionSlice";
import { useEffect, type ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { isLoaded } = useSelector((state: RootState) => state.session);

  // 🔥 FastAPI 세션 복원만 담당
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // 1) 토큰 자체가 없으면 → "로그인 안 되어 있음" 상태로 확정
    if (!token) {
      dispatch(clearSession());
      return;
    }

    // 2) 토큰이 있으면 /auth/me로 검증
    const initSession = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ 세션 복원 성공
        dispatch(setSession({ user: res.data, source: "fastapi" }));
      } catch (err) {
        console.error("FastAPI 세션 복원 실패:", err);
        localStorage.removeItem("access_token");

        // ❌ 토큰이 깨졌거나 만료된 경우 → 비로그인 상태로 확정
        dispatch(clearSession());
      }
    };

    void initSession();
  }, [dispatch]);

  // 세션 로딩 결과가 확정될 때까지 로더
  if (!isLoaded) {
    return <GlobalLoader />;
  }

  return <>{children}</>;
}
