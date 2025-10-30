// src/router.tsx
import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import AppLayout from "./AppLayout";

// --- 페이지 컴포넌트 (lazy 로드) ---
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const GroupsPage = lazy(() => import("./pages/groups/GroupsPage"));
const GroupCreatePage = lazy(() => import("./pages/groups/GroupCreatePage"));
const GroupDetailPage = lazy(() => import("./pages/groups/GroupDetailPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const Notifications = lazy(() => import("./pages/NotificationsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const FindPwPage = lazy(() => import("./pages/auth/FindPwPage"));

// --- 라우터 정의 ---
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/groups", element: <GroupsPage /> },
      { path: "/groups/new", element: <GroupCreatePage /> },
      { path: "/groups/:id", element: <GroupDetailPage /> },
      { path: "/profile/:id", element: <ProfilePage /> },
      { path: "/notifications/:id", element: <Notifications /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/find/password", element: <FindPwPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
