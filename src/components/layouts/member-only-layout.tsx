import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hook/queries/use-app-dispatch";
import GlobalLoader from "./global-loader";

export default function MemberOnlyLayout() {
  const { session, isLoaded } = useAppSelector((state) => state.session);

  // 세션 확인 전엔 로딩 표시
  if (!isLoaded) {
    return <GlobalLoader />;
  }

  // 세션 없으면 로그인
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 로그인 상태면 하위 라우트 표시
  return <Outlet />;
}
