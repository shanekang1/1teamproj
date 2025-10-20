import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import AppBoot from "./components/AppBoot";
import Layout from "./components/layout/Layout"; // 공통 레이아웃

// Lazy
const Main = lazy(() => import("./pages/Main"));
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Business = lazy(() => import("./pages/Business"));
const BusinessEdit = lazy(() => import("./pages/BusinessEdit"));
const BusinessSwitch = lazy(() => import("./pages/BusinessSwitch"));
const Staff = lazy(() => import("./pages/Staff"));
const ProfileReauth = lazy(() => import("./pages/ProfileReauth"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const ExpenseAnalysis = lazy(() => import("./pages/ExpenseAnalysis"));

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴 숨김할 곳
  const hideMenuPaths = ["/login", "/landing"];
  const shouldHideMenu = hideMenuPaths.includes(location.pathname);

  return (
    <div>
      <AppBoot />

      <Suspense
        fallback={
          <div style={{ textAlign: "center", padding: "40px" }}>
            로딩 중...
          </div>
        }
      >
        <Routes>
          {/* 메뉴 없는 페이지 */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* 공통 레이아웃 페이지 */}
          <Route
            element={
              !shouldHideMenu && (
                <Layout
                  onMenuOpen={() => setMenuOpen(true)}
                  menuOpen={menuOpen}
                  onClose={() => setMenuOpen(false)}
                />
              )
            }
          >
            <Route path="/" element={<Main />} />
            <Route path="/business" element={<Business />} />
            <Route path="/business/edit" element={<BusinessEdit />} />
            <Route path="/business/switch" element={<BusinessSwitch />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/profile/reauth" element={<ProfileReauth />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/analysis" element={<ExpenseAnalysis />} />
          </Route>

          {/* 404 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
