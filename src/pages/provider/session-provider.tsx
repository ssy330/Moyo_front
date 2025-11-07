import GlobalLoader from "@/components/layouts/global-loader";
import { useProfileData } from "@/hook/use-profile-data";
import supabase from "@/lib/supabase";
import { setSession } from "@/features/sessionSlice"; // ✅ Redux 액션 import
import type { RootState } from "@/store/store";
import { useEffect, type ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  // ✅ Redux에서 세션 상태 가져오기
  const session = useSelector((state: RootState) => state.session.session);
  const isSessionLoaded = useSelector(
    (state: RootState) => state.session.isLoaded,
  );

  // ✅ 세션 변경 감시 → Redux 업데이트
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setSession(session));
      },
    );

    // ✅ cleanup
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  // ✅ 프로필 데이터 로드
  const { data: profile, isLoading: isProfileLoading } = useProfileData(
    session?.user?.id,
  );

  // ✅ 로딩 중이면 전역 로더 표시
  if (!isSessionLoaded) return <GlobalLoader />;
  if (isProfileLoading) return <GlobalLoader />;

  return <>{children}</>;
}
