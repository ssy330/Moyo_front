// src/router.tsx
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import AppLayout from "./AppLayout"

// --- 페이지 컴포넌트 (lazy 로드) ---
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const GroupsPage = lazy(() => import("./pages/groups/GroupsPage"));
const GroupDetailPage = lazy(() => import("./pages/groups/GroupDetailPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));


// --- 라우터 정의 ---
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/groups", element: <GroupsPage /> },
      { path: "/groups/:id", element: <GroupDetailPage /> },
      { path: "/profile/:id", element: <ProfilePage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <NotFoundPage /> },
]);