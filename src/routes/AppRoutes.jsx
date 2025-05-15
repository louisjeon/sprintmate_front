import React from "react";
import { Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import TeamListPage from "../pages/team/TeamListPage";
import TeamDetailPage from "../pages/team/TeamDetailPage";
import ProjectDetailPage from "../pages/project/ProjectDetailPage";
import ErrorBoundary from "../components/layout/ErrorBoundary";

export const AppRoutes = [
  <Route element={<MainLayout />} key="mainLayout">
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route
      path="/teams"
      element={
        <ErrorBoundary>
          <TeamListPage />
        </ErrorBoundary>
      }
    />
    <Route path="/teams/:teamId" element={<TeamDetailPage />} />
    <Route
      path="/teams/:teamId/projects/:projectId"
      element={<ProjectDetailPage />}
    />
  </Route>,
];
