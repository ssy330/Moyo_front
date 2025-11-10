import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hook/use-app-dispatch";
import GlobalLoader from "./global-loader";

export default function MemberOnlyLayout() {
  const { session, isLoaded } = useAppSelector((state) => state.session);

  // ✅ 1️⃣ 세션 확인 전엔 로딩 표시
  if (!isLoaded) {
    return <GlobalLoader />;
  }

  // ✅ 2️⃣ FastAPI 토큰이 있는 경우엔 아직 세션 없어도 통과
  const hasFastApiToken = !!localStorage.getItem("access_token");

  if (!session && !hasFastApiToken) {
    // 완전히 비로그인 상태
    return <Navigate to="/login" replace />;
  }

  // ✅ 3️⃣ 로그인 상태면 하위 라우트 표시
  return <Outlet />;
}
