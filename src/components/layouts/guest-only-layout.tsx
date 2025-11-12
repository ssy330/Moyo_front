import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hook/queries/use-app-dispatch"; // RTK용 커스텀 훅
import GlobalLoader from "./global-loader";

export default function GuestOnlyLayout() {
  const { session, isLoaded } = useAppSelector((state) => state.session);

  // ✅ 세션 로드 전에는 로딩 화면 표시
  if (!isLoaded) {
    return <GlobalLoader />;
  }

  // ✅ 이미 로그인된 경우 홈으로 리다이렉트
  if (session) return <Navigate to="/" replace />;

  // ✅ 비로그인 상태면 하위 라우트 표시
  return <Outlet />;
}
