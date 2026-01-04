import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Auth/Login";
import CreateArticle from "./pages/admin/Articles/CreateArticle";
import Dashboard from "./pages/admin/Dashboard";
import { NotificationProvider } from "./context/NotificationProvider";
import MyArticles from "./pages/admin/Articles/MyArticles";
import Income from "./pages/admin/Income/Income";
import AuthorProfile from "./pages/admin/Profile/AuthorProfile";
import ModLayout from "./layouts/ModLayout";
import UserPage from "./features/User/UserPage";
import ModDashboard from "./pages/admin/ModDashboard";
import ModStatistics from "./pages/moderator/ModStatistics/ModStatistics.JSX";
import ReviewArticle from "./pages/admin/Review/ReviewArticle";
import ModModerationList from "./pages/admin/Review/ModModerationList";
import ReportManager from "./pages/admin/Reports/ReportManager";
import { Settings } from "lucide-react";
import SettingsPage from "./pages/admin/Settings/SettingsPage";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("user_role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Chuyển tất cả về viết thường để so sánh chính xác
  const currentRole = userRole?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  if (allowedRoles && !normalizedAllowedRoles.includes(currentRole)) {
    // Nếu là admin thì luôn có quyền vào cả 2 bên (tùy bạn quy định)
    if (currentRole === "admin") return children;

    const fallbackPath = currentRole === "author" ? "/admin" : "/login";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

function App() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("user_role")?.toLowerCase();

  return (
    <NotificationProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["author", "admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="write" element={<CreateArticle />} />
          <Route path="articles" element={<MyArticles />} />
          <Route path="edit/:id" element={<CreateArticle />} />
          <Route path="earnings" element={<Income />} />
          <Route path="profile" element={<AuthorProfile />} />
        </Route>

        <Route
          path="/moderator"
          element={
            <ProtectedRoute allowedRoles={["moderator", "admin"]}>
              <ModLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ModDashboard />} />

          <Route path="users" element={<UserPage />} />
          <Route path="statistics" element={<ModStatistics />} />
          <Route path="/moderator/moderation" element={<ModModerationList />} />
          <Route path="/moderator/review/:id" element={<ReviewArticle />} />
          <Route path="/moderator/reports" element={<ReportManager />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to={userRole === "author" ? "/admin" : "/moderator"}
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
