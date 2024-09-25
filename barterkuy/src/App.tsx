import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Login from "./pages/auth/login";
import Home from "./pages/home";
import Signup from "./pages/auth/signup";
import OtpVerification from "./pages/auth/otpVerification";
import Navbar from "./layouts/navbar/navbar";
import DetailBarang from "./pages/detail/detailBarang";
import LikeBarang from "./pages/like_barang/likedBarang";

function App() {
  const location = useLocation();

  const id = useSelector((state: RootState) => state.user.id_barang)

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/otpVerification" || location.pathname === `/detail/${id}`

  return (
    <>
      <div className="wrapper-all">
        <div className="wrapper-content font-fira-sans">
          {!hideNavbar && <Navbar/>}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otpVerification" element={<OtpVerification />} />
            <Route path={`/detail/${id}`} element={<DetailBarang />} />
            <Route path="/liked" element={<LikeBarang />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
