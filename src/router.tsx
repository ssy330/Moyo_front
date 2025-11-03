// src/router.tsx
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import GlobalLoader from "@/components/global-loader"; // ✅ 추가

// --- 페이지 컴포넌트 (lazy 로드) ---
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const GroupLayout = lazy(() => import("./pages/groups/GroupLayout"));
const GroupCreatePage = lazy(() => import("./pages/groups/GroupCreatePage"));
const GroupDetailPage = lazy(() => import("./pages/groups/GroupDetailPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const SettingsLayout = lazy(() => import("./pages/settings/SettingsLayout"));
const Notifications = lazy(() => import("./pages/NotificationsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const FindPwPage = lazy(() => import("./pages/auth/FindPwPage"));
const CalendarPage = lazy(() => import("./pages/calendar/CalendarPage"));

// --- 라우터 정의 ---
export const router = createBrowserRouter([
  {
    element: (
      // ✅ 전체 레이아웃 Suspense로 감싸기
      <Suspense fallback={<GlobalLoader />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/groups", element: <GroupLayout /> },
      { path: "/groups/new", element: <GroupCreatePage /> },
      { path: "/groups/:id", element: <GroupDetailPage /> },
      { path: "/profile/:id", element: <ProfilePage /> },
      { path: "/notifications/:id", element: <Notifications /> },
      { path: "/calendar", element: <CalendarPage /> }, // ✅ calender → calendar 오타 수정
      { path: "/settings", element: <SettingsLayout /> },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: "/find/password",
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <FindPwPage />
      </Suspense>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
]);
