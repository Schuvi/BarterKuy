import { createBrowserRouter, useLocation, Outlet, matchPath } from "react-router-dom";
import LoginApp from "@/pages/auth/login/loginPage";
import HomePage from "@/pages/home/homePage";
import SignUpPage from "@/pages/auth/signup/signUpPage";
import OtpVerifPage from "@/pages/auth/otpVerify/otpVerifPage";
import DetailBarang from "@/pages/detail/detailBarang";
import LikeBarang from "@/pages/likeBarang/likedBarang";
import SearchPage from "@/pages/search/searchPage";
import Navbar from "@/layouts/navbar/navbar";
import GiveThings from "@/pages/pengajuan/pengajuanPage";

function Layout() {
  const location = useLocation();

  const hideNavbarRouted = ["/login", "/signup", "/otp_verification", "/detail/:id"];

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
        element: <HomePage />,
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
        element: <DetailBarang />,
        caseSensitive: true,
      },
      {
        path: "/liked",
        element: <LikeBarang />,
        caseSensitive: true,
      },
      {
        path: "/search",
        element: <SearchPage />,
        caseSensitive: true,
      },
      {
        path: "/give",
        element: <GiveThings />,
        caseSensitive: true,
      },
    ],
  },
]);

export default router;
