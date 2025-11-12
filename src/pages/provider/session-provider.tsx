// ✅ src/components/providers/SessionProvider.tsx
import GlobalLoader from "@/components/layouts/global-loader";
import { useProfileData } from "@/hook/queries/use-profile-data";
import supabase from "@/lib/supabase";
import { setSession, clearSession } from "@/features/sessionSlice";
import type { RootState } from "@/store/store";
import { useEffect, type ReactNode, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { api } from "@/lib/api";

// ✅ 유저 ID 안전 추출 헬퍼
function getUserId(session: any): string | number | undefined {
  if (!session) return undefined;
  if ("user_id" in session) return session.user_id; // FastAPI user
  if ("id" in session) return session.id; // Supabase user
  return undefined;
}

export default function SessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [loginSource, setLoginSource] = useState<"fastapi" | "supabase" | null>(
    null,
  );

  const session = useSelector((state: RootState) => state.session.session);

  // ✅ 1️⃣ 로그인 직후 fastapi 토큰이 이미 존재하면 임시 세션 표기
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !session) {
      dispatch(setSession({ user: null, source: "fastapi" }));
    }
  }, [dispatch, session]);

  // ✅ 2️⃣ 실제 세션 복원 절차
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initSession = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // ✅ FastAPI 세션 복원
        if (token) {
          try {
            const res = await api.get("/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(setSession({ user: res.data, source: "fastapi" }));
            setLoginSource("fastapi");
          } catch (err) {
            console.error("FastAPI 세션 복원 실패:", err);
            localStorage.removeItem("access_token");
            dispatch(clearSession());
          } finally {
            setLoading(false);
          }
          return;
        }

        // ✅ Supabase 세션 감시 시작
        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (session) {
              dispatch(setSession({ user: session.user, source: "supabase" }));
              setLoginSource("supabase");
            } else {
              dispatch(clearSession());
              setLoginSource(null);
            }
          },
        );

        unsubscribe = () => listener.subscription.unsubscribe();

        // ✅ 초기 Supabase 세션 확인
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          dispatch(setSession({ user: data.session.user, source: "supabase" }));
          setLoginSource("supabase");
        } else {
          dispatch(clearSession());
        }
      } catch (err) {
        console.error("세션 복원 실패:", err);
        localStorage.removeItem("access_token");
        dispatch(clearSession());
      } finally {
        setLoading(false);
      }
    };

    initSession();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // ✅ 3️⃣ Supabase 로그인 시 프로필 요청
  const userId = getUserId(session);
  const shouldFetchProfile =
    loginSource === "supabase" && typeof userId === "string";
  const { isLoading: isProfileLoading } = useProfileData(
    shouldFetchProfile ? (userId as string) : undefined,
  );

  // ✅ 4️⃣ 로딩 스피너 조건
  if (loading || (shouldFetchProfile && isProfileLoading)) {
    return <GlobalLoader />;
  }

  return <>{children}</>;
}
