import { createBrowserRouter, useLocation, Outlet, matchPath, useMatch } from "react-router-dom";
import LoginApp from "@/pages/auth/login/loginPage";
import HomePage from "@/pages/home/homePage";
import SignUpPage from "@/pages/auth/signup/signUpPage";
import OtpVerifPage from "@/pages/auth/otpVerify/otpVerifPage";
import DetailBarang from "@/pages/detail/detailBarang";
import LikeBarang from "@/pages/likeBarang/likedBarang";
import SearchPage from "@/pages/search/searchPage";
import Navbar from "@/layouts/navbar/navbar";
import ProfilePage from "@/pages/profile/profilePage";
import GiveThings from "@/pages/pengajuan/pengajuanPage";
import ProtectedRoute from "./protectedRoute";

function Layout() {
  const location = useLocation();

  const hideNavbarRouted = ["/login", "/signup", "/otp_verification"];

  const isDetailPage = matchPath("/detail/:id", location.pathname);

  const shouldHideNavbar = hideNavbarRouted.includes(location.pathname) || isDetailPage;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    caseSensitive: true,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginApp />,
        caseSensitive: true,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
        caseSensitive: true,
      },
      {
        path: "/otp_verification",
        element: <OtpVerifPage />,
        caseSensitive: true,
      },
      {
        path: "/detail/:id",
        element: (
          <ProtectedRoute>
            <DetailBarang />
          </ProtectedRoute>
        ),
        caseSensitive: true,
      },
      {
        path: "/liked",
        element: (
          <ProtectedRoute>
            <LikeBarang />
          </ProtectedRoute>
        ),
        caseSensitive: true,
      },
      {
        path: "/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
        caseSensitive: true,
      },
      {
        path: "/give",
        element: (
          <ProtectedRoute>
            <GiveThings />
          </ProtectedRoute>
        ),
        caseSensitive: true,
      },
      {
        path: "/profile/:user_id",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
        caseSensitive: true,
      },
      {
        path: "*",
        element: (
          <>
            <h1 className="text-center mt-4">Halaman tidak ada</h1>
          </>
        ),
      },
    ],
  },
]);

export default router;
