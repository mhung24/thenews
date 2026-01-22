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
import SettingsPage from "./pages/admin/Settings/SettingsPage";
import VNDailyHome from "./pages/reader/Home/components/VNDailyHome";
import VNDailyDetail from "./pages/reader/Details/VNDailyDetail";
import CategoryPage from "./pages/reader/Details/CategoryPage";
import ProfilePage from "./pages/reader/Profile/ProfilePage";
import BookmarksPage from "./pages/reader/Home/Bookmark/BookmarksPage";
import PolicyPage from "./pages/reader/PolicyPage";
import NotFoundPage from "./pages/client/NotFound/NotFoundPage";
import AuthorProfilePage from "./pages/reader/Profile/AuthorProfilePage";
import AdminArticleManagement from "./pages/admin/Articles/AdminArticleManagement";
import CategoryTagManagement from "./pages/admin/CategoryTagManagement";
import LatestArticles from "./pages/reader/Home/LatestArticles/LatestArticles";
import PremiumArticles from "./pages/reader/Home/PremiumArticles/PremiumArticles";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("user_role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = userRole?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  if (allowedRoles && !normalizedAllowedRoles.includes(currentRole)) {
    if (currentRole === "admin") return children;
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<VNDailyHome />} />
        <Route path="/article/:slug" element={<VNDailyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/tag/:tagName" element={<CategoryPage />} />
        <Route path="/search" element={<CategoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/privacy" element={<PolicyPage />} />
        <Route path="/terms" element={<PolicyPage />} />
        <Route path="/recruitment" element={<PolicyPage />} />
        <Route path="/contact-ads" element={<PolicyPage />} />
        <Route path="/author/:id" element={<AuthorProfilePage />} />

        <Route path="/latest" element={<LatestArticles />} />
        <Route path="/premium" element={<PremiumArticles />} />

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
          <Route path="moderation" element={<ModModerationList />} />
          <Route path="review/:id" element={<ReviewArticle />} />
          <Route path="reports" element={<ReportManager />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="article" element={<AdminArticleManagement />} />
          <Route path="tags-categories" element={<CategoryTagManagement />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
