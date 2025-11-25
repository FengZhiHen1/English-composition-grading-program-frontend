import React from "react";
import Home from "./pages/Home";
import UploadPage from "./pages/UploadPage";
import AnalysisReport from "./pages/AnalysisReport";
import ProfilePage from "./pages/ProfilePage";
import QueuePage from "./pages/QueuePage";
import PreviewPage from "./pages/PreviewPage";

export type AppRoute = {
  path: string;
  element: React.ReactElement;
  protected?: boolean;
  // 今后可添加：title?: string; layout?: React.ComponentType; exact?: boolean;
};

const routes: AppRoute[] = [
  { path: "/", element: <Home /> },
  { path: "/upload", element: <UploadPage /> },
  { path: "/queue", element: <QueuePage /> },
  { path: "/preview/:id", element: <PreviewPage /> },
  { path: "/report", element: <AnalysisReport />, protected: true },
  { path: "/profile", element: <ProfilePage /> },
];

export default routes;