import GlobalLoader from "@/components/layouts/global-loader";
import { api } from "@/lib/api";
import type { RootState } from "@/store/store";
import { clearSession, setSession } from "@/features/sessionSlice";
import { useEffect, type ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapBackendUserToSessionUser } from "@/features/mapBackendUserToSessionUser";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { isLoaded } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      dispatch(clearSession());
      return;
    }

    const initSession = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const me = res.data;

        // ✅ 세션 복원 성공
        dispatch(
          setSession({
            user: mapBackendUserToSessionUser(me),
            source: "fastapi",
          }),
        );
      } catch (err) {
        console.error("FastAPI 세션 복원 실패:", err);
        localStorage.removeItem("access_token");

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
