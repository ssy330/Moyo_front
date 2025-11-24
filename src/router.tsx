// src/router.tsx
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import GlobalLoader from "@/components/layouts/global-loader";

// ✅ 보호 레이아웃 import
import MemberOnlyLayout from "@/components/layouts/member-only-layout";
import GuestOnlyLayout from "@/components/layouts/guest-only-layout";

// --- 페이지 (lazy 로드) ---
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage2"));
const FindPwPage = lazy(() => import("./pages/auth/FindPwPage"));
const GroupLayout = lazy(() => import("./pages/groups/GroupLayout"));
const GroupCreatePage = lazy(() => import("./pages/groups/GroupCreatePage2"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const SettingsLayout = lazy(() => import("./pages/settings/SettingsLayout"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const CalendarPage = lazy(() => import("./pages/calendar/CalendarPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// --- 라우터 정의 ---
export const router = createBrowserRouter([
  // ✅ 로그인된 사용자만 접근 가능한 라우트
  {
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <MemberOnlyLayout />
      </Suspense>
    ),
    children: [
      {
        element: <AppLayout />, // 앱 공통 레이아웃
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/groups/:id", element: <GroupLayout /> },
          { path: "/groups/new", element: <GroupCreatePage /> },
          { path: "/profile/:id", element: <ProfilePage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/calendar", element: <CalendarPage /> },
          { path: "/settings", element: <SettingsLayout /> },
        ],
      },
    ],
  },

  // 비로그인 사용자만 접근 가능한 라우트
  {
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <GuestOnlyLayout />
      </Suspense>
    ),
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/find/password", element: <FindPwPage /> },
    ],
  },

  // ✅ 404
  {
    path: "*",
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
