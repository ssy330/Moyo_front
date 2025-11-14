import GlobalLoader from "@/components/layouts/global-loader";
import { api } from "@/lib/api";
import supabase from "@/lib/supabase";
import type { RootState } from "@/store/store";
import { useProfileData } from "@/hook/queries/use-profile-data";
import { setSession, clearSession } from "@/features/sessionSlice";
import { useEffect, type ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserId } from "@/utils/session";

// ✅ SessionProvider.tsx (수정)
export default function SessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { session, isLoaded, source } = useSelector(
    (state: RootState) => state.session,
  );

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initSession = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(setSession({ user: res.data, source: "fastapi" }));
          return;
        } catch (err) {
          console.error("FastAPI 세션 복원 실패:", err);
          localStorage.removeItem("access_token");
        }
      }

      // ✅ Supabase 세션 감시
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            dispatch(setSession({ user: session.user, source: "supabase" }));
          } else {
            dispatch(clearSession());
          }
        },
      );
      unsubscribe = () => listener.subscription.unsubscribe();

      // ✅ 초기 Supabase 세션 확인
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        dispatch(setSession({ user: data.session.user, source: "supabase" }));
      } else {
        dispatch(clearSession());
      }
    };

    initSession();
    return () => unsubscribe?.();
  }, [dispatch]);

  // ✅ 프로필 fetch 조건
  const userId = getUserId(session);
  const shouldFetchProfile =
    source === "supabase" && typeof userId === "string";
  const { isLoading: isProfileLoading } = useProfileData(
    shouldFetchProfile ? (userId as string) : undefined,
  );

  // ✅ Redux에서 세션 로드 완료 & 프로필까지 완료될 때만 렌더링
  if (!isLoaded || (shouldFetchProfile && isProfileLoading)) {
    return <GlobalLoader />;
  }

  return <>{children}</>;
}
